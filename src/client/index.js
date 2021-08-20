/*Imports*/
import { generatePage } from './js/app'
import { newPage } from './js/app'

/*CSS*/
import './styles/style.scss'

/*Submit event handler*/
document.querySelector("form").addEventListener("submit", generatePage);
document.getElementById("reset").addEventListener("click", newPage);

/*Export the imports to pass along*/
export {generatePage, newPage}