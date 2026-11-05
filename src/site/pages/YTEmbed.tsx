function YTEmbed() {
  return (
    <section>
      <title>My Music on YouTube</title>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="p-6">My Music on YouTube</h1>
        <p>All my favorite YouTube Music Playlists in one place.</p>
        <iframe
          title="Youtube Music waterLilith"
          src="https://widgets.sociablekit.com/youtube-playlists/iframe/25690597"
          className="w-full h-screen"
        ></iframe>
      </div>
    </section>
  )
}

export default YTEmbed
