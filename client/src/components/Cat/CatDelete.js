import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CatDelete = ({deleteHandler}) => {
    const location = useLocation();
    const cat = location.state.cat;
    const [button, setButton] = useState('');
    const navigate = useNavigate();
    const formHandler = (e) => {
        e.preventDefault();
        if(button==='Yes')
            deleteHandler(cat);
        navigate('/cats');
    }
    return (
        <form onSubmit={formHandler}>
            <div>
                <h2>Are you sure you want to delete {cat.name}?</h2>
            </div>
            <button value="Yes" onClick={(e)=>{setButton(e.target.value)}}>Yes</button>
            <button value="No" onClick={(e)=>{setButton(e.target.value)}}>No</button>
        </form>
    );
}

export default CatDelete;