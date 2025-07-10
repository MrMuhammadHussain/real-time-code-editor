import Avvvatars from "avvvatars-react";

const Client = ({ username }) => {
    return (
        <div className="client">
            <Avvvatars  size={50} radius={8} value={username} />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;