import React from 'react'
import './Header.css'
import MenuItem from './MenuItem'

export default function Navbar() {
    return (
        <nav>
            <MenuItem name="Home" />
            <MenuItem name="Beneficios" />
            <MenuItem
                name="Que es Blockchain?"
                options={[
                    'Fiabilidad de la documentación',
                    'Seguridad',
                    'Acceso a la información lapido y ordenado',
                    'Información en tiempo real                   ',
                ]}
            />
            <MenuItem name="Seguridad" />
            <MenuItem name="Acceso" />
            <MenuItem name="FAQ" />
        </nav>
    )
}
