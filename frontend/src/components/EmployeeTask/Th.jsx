function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}
export default Th