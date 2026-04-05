export default function MobileLayout({ hero, sidebar, content }) {
  return (
    <main className="cineai-mobileShell">
      {hero}
      <div className="cineai-mobileStack">
        {sidebar}
        {content}
      </div>
    </main>
  );
}
