const methods = {
	POST: '<span style="color: orange; background:rgb(50,50,50); border-radius: 5px; padding: 2px 5px">POST</span>',
	GET: '<span style="color: green; background:rgb(50,50,50); border-radius: 5px; padding: 2px 5px">GET</span>',
	PUT: '<span style="color: blue; background:rgb(50,50,50); border-radius: 5px; padding: 2px 5px">PUT</span>',
	DELETE: '<span style="color: red; background:rgb(50,50,50); border-radius: 5px; padding: 2px 5px">DELETE</span>',
	PATCH: '<span style="color: magenta; background:rgb(50,50,50); border-radius: 5px; padding: 2px 5px">PATCH</span>',
};

const methodColors = {
	POST: 'orange',
	GET: 'green',
	PUT: 'blue',
	DELETE: 'red',
	PATCH: 'magenta',
}

/**
 * Generate markdown documentation from Postman API response
 * @param {PostmanAPIResponse} postmanRes The Postman API response
 * @param {String} target The target environment for the documentation (default: local, options: local, github) 
 * @returns {String} The generated markdown documentation String
 */
function generateDocs(postmanRes, target='local') {

	let markdown = target === 'local' ? `<span style="font-size: 2.4rem; font-weight: 500"> ${postmanRes.collection.info.name}</span>\n--\n` 
		: `# ${postmanRes.collection.info.name}\n\n`;

	markdown += `${postmanRes.collection.info.description}\n\n`;
	markdown += '---\n\n';

	markdown += handleFolders(postmanRes.collection.item, target);

	return markdown;
}

/**
 * 
 * @param {} folders 
 * @returns 
 */
function handleFolders(folders, target) {
	let markdown = '';
	folders.forEach((folder) => {
		markdown += '<details open>\n';
		markdown += target === 'local' ? `<summary style="font-size: 2.125rem; font-weight: 500">${folder.name}</summary>\n\n` 
			: `<summary>${huge(folder.name)}</summary>\n\n`;
		markdown += `${folder.description}\n\n`;

		markdown += handleRequests(folder.item, target);
		markdown += '</details>\n\n';
		markdown += '---\n\n';
	});

	return markdown;
}

/**
 * 
 * @param {Array<PostmanRequest>} requests 
 * @param {*} target 
 * @returns 
 */
function handleRequests(requests, target) {
	let markdown = '';
	requests.forEach((request) => {
		const reqTitle = target === 'local' ? `<span style="font-size: 1.675rem; font-weight: 500;"> ${methods[request.request.method]} ${request.name}</span>\n\n`
			: `${badge(request.request.method, null, methodColors[request.request.method])} ${huge(request.name)}\n`;
		markdown += reqTitle;
		markdown += `> \`\`\`\n> http://localhost:${process.env.PORT}/${request.request.url.path.join('/')}\n> \`\`\`\n> `;
		if (request.request.description) {
			markdown += `\n> ${request.request.description.split('\n').join('\n> ')}\n>\n`;
			if (target === 'local') markdown += span(-10);
		}

		if (request.response.length)
			markdown += handleResponses(request.response, target);

		markdown += '>' + span(30);
	});

	return markdown;
}

function handleResponses(responses, target) {
	let markdown = '';
	if (target === 'github') {
		markdown += '> '
	}
	markdown += '### Example Responses\n>\n';
	if (target === 'local') markdown += span(-10);
	responses.forEach((response) => {
		if (response.code) {
			markdown += '>' + handleErrCode(response.code, response.name, target) + '\n>\n';
		}
		markdown += `> \`\`\`json\n> ${response.body?.split('\n').join('\n> ')}\n> \`\`\`\n> \n`;
	});

	markdown += span(30);
	return markdown;
}

function handleErrCode(code, name, target) {
	console.log(name.split(' ').join('-'));
	if (target === 'local') {
		return `<span style="color: ${code >= 200 && code < 300 ? 'green' : 'red'}; 
		background:rgb(50,50,50); border-radius: 5px; padding: 2px 3px">${code}</span>`;
	} else {
		return badge(code, name, code >= 200 && code < 300 ? 'green' : 'red', 30);
	}
}

function span(size) {
	return `<div style="margin-top: ${size}px"></div>\n\n`;
}

function huge(text) {
	return `$\\huge{\\texttt{${text}}}$`;
}

function badge(label, message, color, size=null) {
	return `<img src="https://img.shields.io/badge/${label}${message ? '-' + message.split(' ').join('_') : ''}-${color}.svg" ${size ? 'height="' + size + '"' : ''}>`;
}

export { generateDocs };

/**
 * @typedef {object} PostmanAPIResponse
 * @property {object} collection The collection of Postman requests
 * @property {object} collection.info The collection information
 * @property {Array<{name: String, item: Array<{name: String, item: Array<{name: String, request: {url: {raw: String}, method: String, description: String}}>}>}>} collection.item The collection items
 */

/**
 * @typedef {object} PostmanFolder
 * @property {String} name The folder name
 * @property {String} description The folder description
 * @property {Array<PostmanRequest>} item The requests in the folder
 */

/**
 * @typedef {object} PostmanRequest
 * @property {String} name The request name
 * @property {String} description The request description
 * @property {PostmanRequestObject} request The request object
 * @property {Array<PostmanResponse>} response The response object
 */

/**
 * @typedef {object} PostmanRequestObject
 * @property {String} method The request method
 * @property {object} url The request URL object
 * @property {String} url.raw The raw URL
 * @property {Array<String>} url.path The URL path
 * @property {Array<{key: String, value: String}>} url.query The URL query parameters
 * @property {Array<{key: String, value: String}>} header The request headers
 * @property {String} body The request body
 * @property {String} name The request name
 * @property {String} id The request id
 */

/**
 * @typedef {object} PostmanResponse
 * @property {String} id The response id
 * @property {String} name The response name
 * @property {number} code The response code
 * @property {String} body The response body
 * @property {String} description The response description
 * @property {Array<{key: String, value: String}>} header The response headers
 * @property {Array<>} cookie The response cookies
 * @property {*} responseTime The response time
 * @property {Array<PostmanRequestObject>} originalRequest The original request
 * @property {String} uid The response UID
 */