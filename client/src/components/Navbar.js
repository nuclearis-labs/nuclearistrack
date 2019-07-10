import React from "react";
import { Menu } from "semantic-ui-react";
import image from "../images/logo.svg";
import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  const handleClick = () => {
    alert("Click");
  };

  const style = {
    menu: { border: "0px", boxShadow: "none" },
    header: { margin: "10px", width: "200px" },
    menuItem: { fontSize: "16px" },
    link: { color: "#000000" }
  };

  return (
    <Menu style={style.menu} borderless fluid>
      <Menu.Item header>
        <img src={image} alt="Logo" style={style.header} />
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item name="listado" style={style.menuItem}>
          <NavLink style={style.link} to="/listado">
            Listado
          </NavLink>
        </Menu.Item>
        <Menu.Item name="subir" style={style.menuItem}>
          <NavLink style={style.link} to="/subir">
            Subir
          </NavLink>
        </Menu.Item>
        <Menu.Item name="chequear" style={style.menuItem}>
          <NavLink style={style.link} to="/chequear">
            Verificar
          </NavLink>
        </Menu.Item>
        <Menu.Item name="acceder" style={style.menuItem}>
          <NavLink style={style.link} to="/acceder">
            Acceder
          </NavLink>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
