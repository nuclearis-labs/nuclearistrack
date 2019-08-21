import React from 'react'

export default function MenuItem(props) {
    return (
        <>
            <div>
                <span>
                    <a href="#">{props.name}</a>
                </span>
                {props.options && (
                    <div class="dropdown-content">
                        {props.options.map(m => {
                            return (
                                <a href="#">
                                    <div class="dropdown-options">{m}</div>
                                </a>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
