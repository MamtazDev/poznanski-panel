import { FileFromEditor } from "./TipTap";


export const getFileData = (file: File, compressedFile: Blob): FileFromEditor => {
	return {
		name: file.name,
		size: compressedFile.size,
		file: compressedFile,
		url: URL.createObjectURL(file),
	};
};

export const convertToEmbedLink = (url: string) => {
	let videoId = null;

	if (url.includes('youtube.com/watch?v=')) {
		const urlParams = new URLSearchParams(new URL(url).search);
		videoId = urlParams.get('v');
	} else if (url.includes('youtu.be/')) {
		videoId = url.split('youtu.be/')[1];
	}

	return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export const collectBlobUrls = (htmlString: string): string[] | null => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');
	const imgElements = doc.getElementsByTagName('img');
	const imgArray: HTMLImageElement[] = Array.from(imgElements);
	if (imgArray.length === 0) {
		return [];
	}
	const blobUrls: string[] = [];
	for (let img of imgArray) {
		const src = img.getAttribute('src');
		if (src && src.startsWith('blob:')) {
			blobUrls.push(src);
		}
	}
	return blobUrls.length > 0 ? blobUrls : null;
}

export const getFilesIncludedInHTML = (
	htmlString: string,
	files: FileFromEditor[]
) => {
	const blobUrls = collectBlobUrls(htmlString);
	if (!blobUrls) {
		return null;
	}
	const filesExcludedFromHTML = files.filter((file) => {
		return !blobUrls.includes(file.url);
	});
	const filesIncludedInHTML = files.filter((file) => {
		return blobUrls.includes(file.url);
	});

	filesExcludedFromHTML.forEach((file) => {
		URL.revokeObjectURL(file.url);
	});
	return filesIncludedInHTML;
};