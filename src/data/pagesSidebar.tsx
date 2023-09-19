import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDashboard, faTableCells, faUsers, faStore, faBoxesStacked, faSign} from "@fortawesome/free-solid-svg-icons";

export const pagesSidebar = [
  {
    name: 'Dashboard',
    icon: <FontAwesomeIcon icon={faDashboard}/>,
    dir: "/admin/dashboard",
    admin: true,
    editor: false,
  },
  {
    name: 'Productos',
    icon: <FontAwesomeIcon icon={faStore}/>,
    dir: "/admin/productos",
    admin: true,
    editor: true,
  },
  {
    name: 'Ordenes',
    icon: <FontAwesomeIcon icon={faBoxesStacked}/>,
    dir: "/admin/ordenes",
    admin: true,
    editor: true,
  },
  {
    name: 'Banners',
    icon: <FontAwesomeIcon icon={faSign}/>,
    dir: "/admin/banners",
    admin: true,
    editor: true,
  },
  {
    name: 'Categorías',
    icon: <FontAwesomeIcon icon={faTableCells}/>,
    dir: "/admin/categorias",
    admin: true,
    editor: true,
  },
  {
    name: 'Usuarios',
    icon: <FontAwesomeIcon icon={faUsers}/>,
    dir: "/admin/usuarios",
    admin: true,
    editor: false,
  },
]