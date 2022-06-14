export const LEGEND = {
    collecting: 'success',
    paused: 'danger',
    expired: 'secondary',
};

const StatisticsLegend = () => {
    return (
        <div className='d-flex gap-2 justify-content-center'>
            {Object.keys(LEGEND).map((key) => (
                <div key={key} className='d-flex gap-2 align-items-center'>
                    <div className={`bg-${LEGEND[key]} rounded`} style={{ height: 20, width: 20 }} />
                    <span className='fst-italic text-secondary'>{key}</span>
                </div>
            ))}
        </div>
    );
};

export default StatisticsLegend;
