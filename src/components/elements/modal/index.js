import React, { useRef } from "react";
import SectionTitle from "../texts/sectionTitle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'


function ModalOverlay(props){

    function showModal(id){
        document.getElementById(id).classList.add("show");
    }

    function closeModal(){
        document.getElementById(props.id).classList.remove("show");
    }

    return(
        <div id={props.id} className="modal-overlay"> 
            <div className="modal-header">
                <span className="close-action" onClick={closeModal}>
                    <FontAwesomeIcon icon={faX} />
                </span>
                <SectionTitle text={props.title} />
            </div>
            <div className="modal-content">
                {props.content}
            </div>
            <div className="modal-footer">
                                
            </div>
        </div>
    )
}

export default ModalOverlay;