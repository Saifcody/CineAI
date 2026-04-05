export default function DesktopLayout({ children, selectedMovie }) {
  return (
    <div className={`cineai-editorialShell ${selectedMovie ? "is-blurred" : ""}`}>
      {children}
    </div>
  );
}
