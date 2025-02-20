import axios from "axios";
import { useEffect, useState } from "react";


function FetcherMaterial() {

    const API_KEY = 'AIzaSyBmYFEkoJIVhA4vD7hqWU3M7bf7djo-9rA'; // Wstaw tutaj swój klucz API
	const CHANNEL_USERNAME = 'poznanskirapcom'; // Nazwa użytkownika kanału
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllChannelVideos = async () => {
			try {
				// Krok 1: Pobierz ID kanału na podstawie nazwy użytkownika
				const channelResponse = await axios.get(
					"https://www.googleapis.com/youtube/v3/channels",
					{
						params: {
							part: 'contentDetails',
							forUsername: CHANNEL_USERNAME,
							key: API_KEY,
						},
					}
				);
               //  console.log(channelResponse)
				const channelId = channelResponse.data.items[0]?.id;

				if (!channelId) {
					console.error('Nie znaleziono kanału');
					setLoading(false);
					return;
				}

				// Krok 2: Pobierz ID playlisty przesłanych filmów (uploads)
				const uploadsPlaylistId =
					channelResponse.data.items[0].contentDetails
						.relatedPlaylists.uploads;

				let allVideos: any = [];
				let nextPageToken = '';

				// Krok 3: Pobierz wszystkie filmy z playlisty uploads
				do {
					const uploadsResponse = await axios.get(
						"https://www.googleapis.com/youtube/v3/playlistItems",
						{
							params: {
								part: 'snippet',
								playlistId: uploadsPlaylistId,
								maxResults: 50, // Maksymalna liczba filmów na stronę
								pageToken: nextPageToken,
								key: API_KEY,
							},
						}
					);

					const videosBatch = uploadsResponse.data.items.map(
						(item: any) => ({
							title: item.snippet.title,
							description: item.snippet.description,
							videoId: item.snippet.resourceId.videoId,
							thumbnail: item.snippet.thumbnails.medium.url,
						})
					);

					allVideos = [...allVideos, ...videosBatch];
					nextPageToken = uploadsResponse.data.nextPageToken;
				} while (nextPageToken);

				setVideos(allVideos);
				setLoading(false);
			} catch (error) {
				console.error('Błąd przy pobieraniu filmów z kanału:', error);
				setLoading(false);
			}
		};

		fetchAllChannelVideos();
      //   console.log("Videos", videos)
	}, []);


  return (
    <div>FetcherMaterial</div>
  )
}

export default FetcherMaterial