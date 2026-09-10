const assert = require("node:assert/strict");
const fs = require("fs/promises");
const path = require("path");
const { after, beforeEach, test } = require("node:test");
const request = require("supertest");
const sharp = require("sharp");
const app = require("../app");
const Scan = require("../models/Scan");

const uploadDirectory = path.join(__dirname, "..", "uploads");
const scanId = "507f1f77bcf86cd799439011";
const imageFiles = {
	frontImage: { name: "front label.jpg", mime: "image/jpeg", format: "jpeg" },
	backImage: { name: "back label.png", mime: "image/png", format: "png" },
	sideImage: { name: "side label.webp", mime: "image/webp", format: "webp" },
};

async function imageBuffer(format, size = 20) {
	return sharp({
		create: {
			width: size,
			height: size,
			channels: 3,
			background: { r: 30, g: 120, b: 200 },
		},
	})
		.toFormat(format)
		.toBuffer();
}

function addAllImages(uploadRequest) {
	return (async () => {
		for (const [field, file] of Object.entries(imageFiles)) {
			uploadRequest.attach(field, await imageBuffer(file.format), {
				filename: file.name,
				contentType: file.mime,
			});
		}
	})();
}

beforeEach(async () => {
	await fs.rm(uploadDirectory, { recursive: true, force: true });
	Scan.findByIdAndUpdate = async (id, update) => ({ _id: id, images: update.$set.images });
});

after(async () => {
	await fs.rm(uploadDirectory, { recursive: true, force: true });
});

test("accepts a valid front image", async () => {
	const response = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(response);
	const result = await response;
	assert.equal(result.status, 201);
	assert.equal(result.body.scan.images.find((image) => image.position === "front").mimeType, "image/jpeg");
});

test("accepts a valid back image", async () => {
	const response = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(response);
	const result = await response;
	assert.equal(result.status, 201);
	assert.equal(result.body.scan.images.find((image) => image.position === "back").mimeType, "image/png");
});

test("accepts a valid side image", async () => {
	const response = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(response);
	const result = await response;
	assert.equal(result.status, 201);
	assert.equal(result.body.scan.images.find((image) => image.position === "side").mimeType, "image/webp");
});

test("rejects unsupported file formats", async () => {
	const response = request(app)
		.post(`/api/scans/${scanId}/images`)
		.attach("frontImage", Buffer.from("not an image"), { filename: "front.gif", contentType: "image/gif" });
	assert.equal((await response).status, 400);
});

test("rejects files larger than the maximum size", async () => {
	const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 1);
	const response = request(app)
		.post(`/api/scans/${scanId}/images`)
		.attach("frontImage", oversized, { filename: "front.jpg", contentType: "image/jpeg" });
	assert.equal((await response).status, 413);
});

test("rejects dangerous non-image content with an image extension", async () => {
	const response = request(app)
		.post(`/api/scans/${scanId}/images`)
		.attach("frontImage", Buffer.from("<script>alert(1)</script>"), { filename: "front.jpg", contentType: "image/jpeg" });
	assert.equal((await response).status, 400);
});

test("rejects a missing required file", async () => {
	const response = request(app)
		.post(`/api/scans/${scanId}/images`)
		.attach("frontImage", await imageBuffer("jpeg"), { filename: "front.jpg", contentType: "image/jpeg" });
	assert.equal((await response).status, 400);
});

test("generates unique image identifiers", async () => {
	const first = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(first);
	const firstResult = await first;
	const second = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(second);
	const secondResult = await second;
	const firstIds = firstResult.body.scan.images.map((image) => image.imageId);
	const secondIds = secondResult.body.scan.images.map((image) => image.imageId);
	assert.equal(new Set([...firstIds, ...secondIds]).size, 6);
});

test("stores image metadata with the scan", async () => {
	let persistedUpdate;
	Scan.findByIdAndUpdate = async (id, update) => {
		persistedUpdate = { id, update };
		return { _id: id, images: update.$set.images };
	};
	const response = request(app).post(`/api/scans/${scanId}/images`);
	await addAllImages(response);
	assert.equal((await response).status, 201);
	assert.equal(persistedUpdate.id, scanId);
	assert.deepEqual(
		persistedUpdate.update.$set.images.map((image) => image.position),
		["front", "back", "side"]
	);
	assert.ok(persistedUpdate.update.$set.images.every((image) => image.storedFilename && image.fileSize && image.uploadedAt));
});