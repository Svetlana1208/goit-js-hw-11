import axios from 'axios';
import { paramsPages } from "../index";


let url;


async function fetchRequest(searchQuery) {
    // page += 1;
    const key = '33264104-6177d05b85a0a5034084eaf54';
    url = `https://pixabay.com/api/?key=${key}&q=${searchQuery}&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads`;
    try {
        const response = await axios.get(`${url}`, {params: {
            page: paramsPages.page,
            per_page: paramsPages.perPage,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }});
        return response.data;
      } catch (error) {
        console.error(error);
      }
}

export default {fetchRequest};
