/* 
	js/theme.js
	Author: Marcin Borkowicz 2018
	Package: Classic Tetris
	Codebase: github.com/Masterboreq/tetris
	Website: boreq.com/tetris
*/

var Theme =  {
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
		cellBackgroundColor: "rgba(7, 9, 3, 0.8)", //kolor tła segmentu studzienki
		backgroundImage: "/sciezka/do/pliku/tla-dla-elementu/#wallpaper.jpg", //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą cellBackgroundColor
	},
	
	/* Wygląd klocków */
	piece: {
		O: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(255,0,0, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		I: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(254,118,0, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		S: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(17,207,245, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		Z: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(0,255,0, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		L: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(0,43,255, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		J: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(255,0,255, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
		T: {
			borderColor: "rgba(255,255,255, 0.2)",
			backgroundColor: "rgba(255,255,0, 1)",
			backgroundImage: "" //JEŻELI: ten zapis NIE jest pusty, to przeważa nad regułą backgroundColor
		},
	}
}