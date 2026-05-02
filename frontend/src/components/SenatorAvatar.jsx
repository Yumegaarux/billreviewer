const senatorImages = {
  "Aquino, Paolo Benigno": "/bam-aquino.png",
  "Cayetano, Alan Peter": "/alan-cayetano.png",
  "Cayetano, Pilar Juliana" : "/pia-cayetano.png",
  "dela Rosa, Ronald": "/bato-dela-rosa.png",
  "Escudero, Francis": "/chiz-escudero.png",
  "Ejercito, Joseph Victor": "/jv-ejercito.png",
  "Go, Christopher Lawrence": "/bong-go.png",
  "Gatchalian, Sherwin": "/sherwin-gatchalian.png",
  "Hontiveros-Baraquel, Ana Theresia": "/risa-hontiveros.png",
  "Marcos, Imee": "/imee-marcos.png",
  "Padilla, Robinhood": "/robin-padilla.png",
  "Pangilinan, Francis": "/kiko-pangilinan.png",
  "Villanueva, Emmanuel Joel": "/joel-villanueva.png",

  "Villar-Genuino, Camille": "/camille-villar.png",
  "Ejercito-Estrada, Jose": "/jinggoy-estrada.png",
  "Legarda, Lorna Regina": "/loren-legarda.png",
  "Sotto, Vicente": "/tito-sotto.png",
  "Tulfo, Rafael": "/raffy-tulfo.png",
  "Tulfo, Erwin": "/erwin-tulfo.png",
  "Villar, Mark": "/mark-villar.png",
  "Zubiri, Juan Miguel": "/migz-zubiri.png",
  'Lapid, Manuel' : "/lito-lapid.png",
};

export default function SenatorAvatar({name}) {
    console.log(name);
    console.log(senatorImages[name]);
    return(
        <img
            src={senatorImages[name]}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-300 shrink-0"
        />
    )
}