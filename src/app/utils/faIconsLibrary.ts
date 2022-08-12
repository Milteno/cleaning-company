import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faTrash,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

export const registerIcons = () => {
  library.add(
    faEdit,
    faTrash,
    faSearch
  );
}

registerIcons();
