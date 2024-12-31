import './home.css'

export default function
    () {
    return (
        <div className="grid-container home-container">
            <div className='fb-win'>
                <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsdmgranthalay&width=1500&height=500&tabs=timeline&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="500"
                    height="500"
                    allow="encrypted-media"
                ></iframe>
            </div>
            <div>
                <p>
                    {/* वाचनास मराठी, हिंदी व इंग्रजी १०,००० (दहा हजाराहून अधिक पुस्तके) व सुसज्ज ५० आसनी स्वतंत्र अभ्यासिका */}
                </p>
            </div>
        </div>
    )
}
