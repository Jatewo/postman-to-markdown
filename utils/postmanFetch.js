import axios from 'axios';

export default async function getPostmanCollection(url) {
	const response = await axios.get(url);

	return response.data;
}