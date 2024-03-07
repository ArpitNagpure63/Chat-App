const Loader = ({ showLoader }) => {
    return showLoader && <div className="absolute">
        <span className="loading loading-spinner loading-lg"></span>
    </div>
};

export default Loader;