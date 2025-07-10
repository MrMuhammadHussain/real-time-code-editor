import Avvvatars from "avvvatars-react";

const Client = ({ username }) => {
    return (
        <div className="client">
            <Avvvatars name={username} size={50} round="14px" />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;