function CompareProperties({ data }) {
  return (
    <ul className="list-unstyled popover-info">
      {Object.keys(data).map((key) => (
        <li>
          <span className="text-muted">
            {key} : {data[key]}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default CompareProperties;
