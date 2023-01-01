import "./Spinner.css";
import spinner from "../../Assets/loading.gif";

function Spinner(): JSX.Element {
    return (
        <div className="Spinner">
			<img src={spinner} />
        </div>
    );
}

export default Spinner;
