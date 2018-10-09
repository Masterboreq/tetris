/* 
	js/skin.js
	Author: Marcin Borkowicz 2018
	Package: Classic Tetris
	Codebase: github.com/Masterboreq/tetris
	Website: boreq.com/tetris
*/

var Skin =  {
	name: "Masterboreq's Classic Tetris",
	stylesheet: "../css/masterboreq-classic.css",
	
	/* Wygląd specyficznych elementów GUI */
	gui: {
		leftBank: "", //TODO: dyskusyjne! Być może wystarczy deklaracja w stylesheet
		rightBank: "", //j.w.
		bottomBank: "", //j.w.
		mainBackground: "/sciezka/do/pliku.jpg", //j.w.
	},
	
	/* Wygląd elementów studzienki */
	well: {
		cellBorderColor: "rgba(255,255,255, 0.2)", //kolor brzegu segmentu studzienki
		cellBackgroundColor: "rgba(230,255,189,1)", //kolor tła segmentu studzienki
		backgroundImage: "/sciezka/do/pliku/tla-dla-elementu/#wallpaper.jpg", //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą cellBackgroundColor
	},
	
	/* Wygląd klocków */
	piece: {
		O: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#ff0d0d",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		I: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#a50000",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		S: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#e43957",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		Z: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#19198e",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		L: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#ad0cad",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		J: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "#00b300",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		T: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "orange",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
	}
}