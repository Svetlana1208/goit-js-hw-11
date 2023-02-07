import axios from 'axios';
// import { searchQuery} from "../index";


let url;
const perPage = 40;
let page = 1;



export async function fetchRequest() {
    const key = '33264104-6177d05b85a0a5034084eaf54';
    url = `https://pixabay.com/api/?key=${key}&q=${searchQuery}&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads`;

    try {
        const response = await axios.get(`${url}`, {params: {
            page: page,
            per_page: perPage,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }});
        return response.data;
      } catch (error) {
        console.error(error);
      }
}
