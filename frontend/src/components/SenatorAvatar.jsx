const senatorImages = {
  "Aquino, Paulo Benigno": "/bam-aquino.png",
  "Cayetano, Alan Peter": "/alan-cayetano.png",
  "Dela Rosa, Ronald": "/bato-dela-rosa.png",
  "Escudero, Francis": "/chiz-escudero.png",
  "Estrada, Joseph Victor": "/jv-ejercito.png",
  "Go, Christopher Lawrence": "/bong-go.png",
  "Gatchalian, Win T.": "/sherwin-gatchalian.png",
  "Hontiveros-Baraquel, Ana Theresia": "/risa-hontiveros.png",
  "Marcos, Imee R.": "/imee-marcos.png",
  "Padilla, Robin": "/robin-padilla.png",
  "Pangilinan, Francis": "/kiko-pangilinan.png",
  "Villanueva, Joel": "/joel-villanueva.png",

  "Villar, Camille A.": "/camille-villar.png",
  "Ejercito Estrada, Jinggoy": "/jinggoy-estrada.png",
  "Legarda, Loren B.": "/loren-legarda.png",
  "Sotto, Vicente": "/tito-sotto.png",
  "Tulfo, Raffy T.": "/raffy-tulfo.png",
  "Tulfo, Erwin": "/erwin-tulfo.png",
  "Villar, Mark A.": "/mark-villar.png",
  "Zubiri, Juan Miguel": "/migz-zubiri.png",
  'Lapid, Manuel "Lito" M.' : "/lito-lapid.png",
};

export default function SenatorAvatar({name}) {
    console.log(name);
    console.log(senatorImages[name]);
    return(
        <img
            src={senatorImages[name]}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
    
    )
}