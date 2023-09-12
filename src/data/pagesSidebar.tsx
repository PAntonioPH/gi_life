import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDashboard, faThumbtack, faTableCells, faUsers, faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";

export const pagesSidebar = [
  {
    name: 'Dashboard',
    icon: <FontAwesomeIcon icon={faDashboard}/>,
    dir: "/admin/dashboard",
    admin: true,
    editor: false,
  },
  {
    name: 'Periódicos',
    icon: <FontAwesomeIcon icon={faNewspaper}/>,
    dir: "/admin/periodicos",
    admin: true,
    editor: true,
  },
  {
    name: 'Video Facebook',
    icon: <FontAwesomeIcon icon={faFacebook}/>,
    dir: "/admin/videoFacebook",
    admin: true,
    editor: true,
  },
  {
    name: 'Entradas',
    icon: <FontAwesomeIcon icon={faThumbtack}/>,
    dir: "/admin/entradas",
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