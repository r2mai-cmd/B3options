/*
 B3Options — camada de dados + interface
 Fonte de mercado: brapi.dev
 - Cotações de ações/ETFs: /api/v2/stocks/quote
 - Opções: /api/v2/options/expirations + /chain
 O token é mantido somente nesta sessão do navegador (sessionStorage).
 Importante: a API de opções da brapi informa dados EOD; não é feed intraday.
*/

const FALLBACK_ASSETS = [{"code":"BOVA11","name":"ISHARES BOVA CI","price":4.0,"change":-4.8,"iv":18.0,"rank":0.0,"pct":0.0,"sector":"Bancos"},{"code":"PETR4","name":"PETROBRAS PN","price":11.83,"change":-3.43,"iv":20.71,"rank":7.3,"pct":5.9,"sector":"Petróleo"},{"code":"ITUB4","name":"ITAUUNIBANCO PN","price":19.66,"change":-2.06,"iv":23.42,"rank":14.6,"pct":11.8,"sector":"Energia"},{"code":"VALE3","name":"VALE ON","price":27.49,"change":-0.69,"iv":26.13,"rank":21.9,"pct":17.7,"sector":"Varejo"},{"code":"BOVV11","name":"BOVV11 ON","price":35.32,"change":0.68,"iv":28.84,"rank":29.2,"pct":23.6,"sector":"Tecnologia"},{"code":"BBAS3","name":"BRASIL ON","price":43.15,"change":2.05,"iv":31.55,"rank":36.5,"pct":29.5,"sector":"Imobiliário"},{"code":"CSMG3","name":"COPASA ON","price":50.98,"change":3.42,"iv":34.26,"rank":43.8,"pct":35.4,"sector":"Mineração"},{"code":"EMBJ3","name":"EMBRAER ON","price":58.81,"change":-4.41,"iv":36.97,"rank":51.1,"pct":41.3,"sector":"Bancos"},{"code":"WEGE3","name":"WEG ON","price":66.64,"change":-3.04,"iv":39.68,"rank":58.4,"pct":47.2,"sector":"Petróleo"},{"code":"RENT3","name":"LOCALIZA ON","price":74.47,"change":-1.67,"iv":42.39,"rank":65.7,"pct":53.1,"sector":"Energia"},{"code":"ENEV3","name":"ENEV3 ON","price":82.3,"change":-0.3,"iv":45.1,"rank":73.0,"pct":59.0,"sector":"Varejo"},{"code":"BBDC4","name":"BRADESCO PN","price":90.13,"change":1.07,"iv":47.81,"rank":80.3,"pct":64.9,"sector":"Tecnologia"},{"code":"BRAV3","name":"BRAV3 ON","price":97.96,"change":2.44,"iv":50.52,"rank":87.6,"pct":70.8,"sector":"Imobiliário"},{"code":"PRIO3","name":"PRIO ON","price":105.79,"change":3.81,"iv":53.23,"rank":94.9,"pct":76.7,"sector":"Mineração"},{"code":"RDOR3","name":"RDOR3 ON","price":113.62,"change":-4.02,"iv":55.94,"rank":1.2,"pct":82.6,"sector":"Bancos"},{"code":"PETR3","name":"PETR3 ON","price":121.45,"change":-2.65,"iv":58.65,"rank":8.5,"pct":88.5,"sector":"Petróleo"},{"code":"ALOS3","name":"ALOS3 ON","price":9.28,"change":-1.28,"iv":61.36,"rank":15.8,"pct":94.4,"sector":"Energia"},{"code":"UGPA3","name":"UGPA3 ON","price":17.11,"change":0.09,"iv":64.07,"rank":23.1,"pct":100.3,"sector":"Varejo"},{"code":"MGLU3","name":"MAGAZ LUIZA ON","price":24.94,"change":1.46,"iv":66.78,"rank":30.4,"pct":5.2,"sector":"Tecnologia"},{"code":"CYRE3","name":"CYRELA REALT ON","price":32.77,"change":2.83,"iv":69.49,"rank":37.7,"pct":11.1,"sector":"Imobiliário"},{"code":"GGBR4","name":"GERDAU PN","price":40.6,"change":4.2,"iv":72.2,"rank":45.0,"pct":17.0,"sector":"Mineração"},{"code":"BPAC11","name":"BTGP BANCO UNT","price":48.43,"change":-3.63,"iv":74.91,"rank":52.3,"pct":22.9,"sector":"Bancos"},{"code":"ABEV3","name":"AMBEV S/A ON","price":56.26,"change":-2.26,"iv":19.62,"rank":59.6,"pct":28.8,"sector":"Petróleo"},{"code":"HAPV3","name":"HAPVIDA ON","price":64.09,"change":-0.89,"iv":22.33,"rank":66.9,"pct":34.7,"sector":"Energia"},{"code":"B3SA3","name":"B3 ON","price":71.92,"change":0.48,"iv":25.04,"rank":74.2,"pct":40.6,"sector":"Varejo"},{"code":"SUZB3","name":"SUZANO S.A. ON","price":79.75,"change":1.85,"iv":27.75,"rank":81.5,"pct":46.5,"sector":"Tecnologia"},{"code":"AZZA3","name":"AZZA3 ON","price":87.58,"change":3.22,"iv":30.46,"rank":88.8,"pct":52.4,"sector":"Imobiliário"},{"code":"LREN3","name":"LOJAS RENNER ON","price":95.41,"change":-4.61,"iv":33.17,"rank":96.1,"pct":58.3,"sector":"Mineração"},{"code":"TOTS3","name":"TOTVS ON","price":103.24,"change":-3.24,"iv":35.88,"rank":2.4,"pct":64.2,"sector":"Bancos"},{"code":"SMAL11","name":"ISHARES SMAL CI","price":111.07,"change":-1.87,"iv":38.59,"rank":9.7,"pct":70.1,"sector":"Petróleo"},{"code":"BEEF3","name":"BEEF3 ON","price":118.9,"change":-0.5,"iv":41.3,"rank":17.0,"pct":76.0,"sector":"Energia"},{"code":"SBFG3","name":"SBFG3 ON","price":6.73,"change":0.87,"iv":44.01,"rank":24.3,"pct":81.9,"sector":"Varejo"},{"code":"USIM5","name":"USIM5 ON","price":14.56,"change":2.24,"iv":46.72,"rank":31.6,"pct":87.8,"sector":"Tecnologia"},{"code":"CSAN3","name":"CSAN3 ON","price":22.39,"change":3.61,"iv":49.43,"rank":38.9,"pct":93.7,"sector":"Imobiliário"},{"code":"MOTV3","name":"MOTV3 ON","price":30.22,"change":-4.22,"iv":52.14,"rank":46.2,"pct":99.6,"sector":"Mineração"},{"code":"AXIA3","name":"AXIA3 ON","price":38.05,"change":-2.85,"iv":54.85,"rank":53.5,"pct":4.5,"sector":"Bancos"},{"code":"AURA33","name":"AURA33 ON","price":45.88,"change":-1.48,"iv":57.56,"rank":60.8,"pct":10.4,"sector":"Petróleo"},{"code":"MOVI3","name":"MOVI3 ON","price":53.71,"change":-0.11,"iv":60.27,"rank":68.1,"pct":16.3,"sector":"Energia"},{"code":"VBBR3","name":"VBBR3 ON","price":61.54,"change":1.26,"iv":62.98,"rank":75.4,"pct":22.2,"sector":"Varejo"},{"code":"ONCO3","name":"ONCO3 ON","price":69.37,"change":2.63,"iv":65.69,"rank":82.7,"pct":28.1,"sector":"Tecnologia"},{"code":"ITSA4","name":"ITAUSA PN","price":77.2,"change":4.0,"iv":68.4,"rank":90.0,"pct":34.0,"sector":"Imobiliário"},{"code":"CSNA3","name":"SID NACIONAL ON","price":85.03,"change":-3.83,"iv":71.11,"rank":97.3,"pct":39.9,"sector":"Mineração"},{"code":"NATU3","name":"NATU3 ON","price":92.86,"change":-2.46,"iv":73.82,"rank":3.6,"pct":45.8,"sector":"Bancos"},{"code":"SBSP3","name":"SBSP3 ON","price":100.69,"change":-1.09,"iv":18.53,"rank":10.9,"pct":51.7,"sector":"Petróleo"},{"code":"COGN3","name":"COGN3 ON","price":108.52,"change":0.28,"iv":21.24,"rank":18.2,"pct":57.6,"sector":"Energia"},{"code":"EQTL3","name":"EQUATORIAL ON","price":116.35,"change":1.65,"iv":23.95,"rank":25.5,"pct":63.5,"sector":"Varejo"},{"code":"BBSE3","name":"BBSE3 ON","price":4.18,"change":3.02,"iv":26.66,"rank":32.8,"pct":69.4,"sector":"Tecnologia"},{"code":"SEER3","name":"SEER3 ON","price":12.01,"change":4.39,"iv":29.37,"rank":40.1,"pct":75.3,"sector":"Imobiliário"},{"code":"GOLD11","name":"GOLD11 ON","price":19.84,"change":-3.44,"iv":32.08,"rank":47.4,"pct":81.2,"sector":"Mineração"},{"code":"QUAL3","name":"QUAL3 ON","price":27.67,"change":-2.07,"iv":34.79,"rank":54.7,"pct":87.1,"sector":"Bancos"},{"code":"CPLE3","name":"CPLE3 ON","price":35.5,"change":-0.7,"iv":37.5,"rank":62.0,"pct":93.0,"sector":"Petróleo"},{"code":"ITUB3","name":"ITAUUNIBANCO ON","price":43.33,"change":0.67,"iv":40.21,"rank":69.3,"pct":98.9,"sector":"Energia"},{"code":"IRBR3","name":"IRBR3 ON","price":51.16,"change":2.04,"iv":42.92,"rank":76.6,"pct":3.8,"sector":"Varejo"},{"code":"MRVE3","name":"MRVE3 ON","price":58.99,"change":3.41,"iv":45.63,"rank":83.9,"pct":9.7,"sector":"Tecnologia"},{"code":"BRAP4","name":"BRAP4 ON","price":66.82,"change":-4.42,"iv":48.34,"rank":91.2,"pct":15.6,"sector":"Imobiliário"},{"code":"RAIZ4","name":"RAIZ4 ON","price":74.65,"change":-3.05,"iv":51.05,"rank":98.5,"pct":21.5,"sector":"Mineração"},{"code":"JBSS32","name":"JBSS32 ON","price":82.48,"change":-1.68,"iv":53.76,"rank":4.8,"pct":27.4,"sector":"Bancos"},{"code":"ASAI3","name":"ASAI3 ON","price":90.31,"change":-0.31,"iv":56.47,"rank":12.1,"pct":33.3,"sector":"Petróleo"},{"code":"MBRF3","name":"MBRF3 ON","price":98.14,"change":1.06,"iv":59.18,"rank":19.4,"pct":39.2,"sector":"Energia"},{"code":"ORVR3","name":"ORVR3 ON","price":105.97,"change":2.43,"iv":61.89,"rank":26.7,"pct":45.1,"sector":"Varejo"},{"code":"EGIE3","name":"EGIE3 ON","price":113.8,"change":3.8,"iv":64.6,"rank":34.0,"pct":51.0,"sector":"Tecnologia"},{"code":"HYPE3","name":"HYPE3 ON","price":121.63,"change":-4.03,"iv":67.31,"rank":41.3,"pct":56.9,"sector":"Imobiliário"},{"code":"GOGL34","name":"GOGL34 ON","price":9.46,"change":-2.66,"iv":70.02,"rank":48.6,"pct":62.8,"sector":"Mineração"},{"code":"TAEE11","name":"TAESA UNT","price":17.29,"change":-1.29,"iv":72.73,"rank":55.9,"pct":68.7,"sector":"Bancos"},{"code":"BOVX11","name":"BOVX11 ON","price":25.12,"change":0.08,"iv":75.44,"rank":63.2,"pct":74.6,"sector":"Petróleo"},{"code":"BRKM5","name":"BRKM5 ON","price":32.95,"change":1.45,"iv":20.15,"rank":70.5,"pct":80.5,"sector":"Energia"},{"code":"TEND3","name":"TEND3 ON","price":40.78,"change":2.82,"iv":22.86,"rank":77.8,"pct":86.4,"sector":"Varejo"},{"code":"BHIA3","name":"BHIA3 ON","price":48.61,"change":4.19,"iv":25.57,"rank":85.1,"pct":92.3,"sector":"Tecnologia"},{"code":"MILS3","name":"MILS3 ON","price":56.44,"change":-3.64,"iv":28.28,"rank":92.4,"pct":98.2,"sector":"Imobiliário"},{"code":"CVCB3","name":"CVCB3 ON","price":64.27,"change":-2.27,"iv":30.99,"rank":99.7,"pct":3.1,"sector":"Mineração"},{"code":"SIMH3","name":"SIMH3 ON","price":72.1,"change":-0.9,"iv":33.7,"rank":6.0,"pct":9.0,"sector":"Bancos"},{"code":"BBDC3","name":"BRADESCO ON","price":79.93,"change":0.47,"iv":36.41,"rank":13.3,"pct":14.9,"sector":"Petróleo"},{"code":"ENGI11","name":"ENGI11 ON","price":87.76,"change":1.84,"iv":39.12,"rank":20.6,"pct":20.8,"sector":"Energia"},{"code":"CMIG4","name":"CEMIG PN","price":95.59,"change":3.21,"iv":41.83,"rank":27.9,"pct":26.7,"sector":"Varejo"},{"code":"CXSE3","name":"CXSE3 ON","price":103.42,"change":-4.62,"iv":44.54,"rank":35.2,"pct":32.6,"sector":"Tecnologia"},{"code":"SMFT3","name":"SMFT3 ON","price":111.25,"change":-3.25,"iv":47.25,"rank":42.5,"pct":38.5,"sector":"Imobiliário"},{"code":"VAMO3","name":"VAMO3 ON","price":119.08,"change":-1.88,"iv":49.96,"rank":49.8,"pct":44.4,"sector":"Mineração"},{"code":"TIMS3","name":"TIM ON","price":6.91,"change":-0.51,"iv":52.67,"rank":57.1,"pct":50.3,"sector":"Bancos"},{"code":"GOAU4","name":"GOAU4 ON","price":14.74,"change":0.86,"iv":55.38,"rank":64.4,"pct":56.2,"sector":"Petróleo"},{"code":"AUAU3","name":"AUAU3 ON","price":22.57,"change":2.23,"iv":58.09,"rank":71.7,"pct":62.1,"sector":"Energia"},{"code":"MULT3","name":"MULT3 ON","price":30.4,"change":3.6,"iv":60.8,"rank":79.0,"pct":68.0,"sector":"Varejo"},{"code":"ISAE4","name":"ISAE4 ON","price":38.23,"change":-4.23,"iv":63.51,"rank":86.3,"pct":73.9,"sector":"Tecnologia"},{"code":"IVVB11","name":"IVVB11 ON","price":46.06,"change":-2.86,"iv":66.22,"rank":93.6,"pct":79.8,"sector":"Imobiliário"},{"code":"RAIL3","name":"RAIL3 ON","price":53.89,"change":-1.49,"iv":68.93,"rank":100.9,"pct":85.7,"sector":"Mineração"},{"code":"JHSF3","name":"JHSF3 ON","price":61.72,"change":-0.12,"iv":71.64,"rank":7.2,"pct":91.6,"sector":"Bancos"},{"code":"ROXO34","name":"ROXO34 ON","price":69.55,"change":1.25,"iv":74.35,"rank":14.5,"pct":97.5,"sector":"Petróleo"},{"code":"CEAB3","name":"CEAB3 ON","price":77.38,"change":2.62,"iv":19.06,"rank":21.8,"pct":2.4,"sector":"Energia"},{"code":"GGPS3","name":"GGPS3 ON","price":85.21,"change":3.99,"iv":21.77,"rank":29.1,"pct":8.3,"sector":"Varejo"},{"code":"ECOR3","name":"ECOR3 ON","price":93.04,"change":-3.84,"iv":24.48,"rank":36.4,"pct":14.2,"sector":"Tecnologia"},{"code":"PSSA3","name":"PSSA3 ON","price":100.87,"change":-2.47,"iv":27.19,"rank":43.7,"pct":20.1,"sector":"Imobiliário"},{"code":"SAPR11","name":"SAPR11 ON","price":108.7,"change":-1.1,"iv":29.9,"rank":51.0,"pct":26.0,"sector":"Mineração"},{"code":"MELI34","name":"MELI34 ON","price":116.53,"change":0.27,"iv":32.61,"rank":58.3,"pct":31.9,"sector":"Bancos"},{"code":"FLRY3","name":"FLRY3 ON","price":4.36,"change":1.64,"iv":35.32,"rank":65.6,"pct":37.8,"sector":"Petróleo"},{"code":"SANB11","name":"SANB11 ON","price":12.19,"change":3.01,"iv":38.03,"rank":72.9,"pct":43.7,"sector":"Energia"},{"code":"VIVA3","name":"VIVA3 ON","price":20.02,"change":4.38,"iv":40.74,"rank":80.2,"pct":49.6,"sector":"Varejo"},{"code":"KLBN11","name":"KLABIN S/A UNT","price":27.85,"change":-3.45,"iv":43.45,"rank":87.5,"pct":55.5,"sector":"Tecnologia"},{"code":"MDIA3","name":"MDIA3 ON","price":35.68,"change":-2.08,"iv":46.16,"rank":94.8,"pct":61.4,"sector":"Imobiliário"},{"code":"INBR32","name":"INBR32 ON","price":43.51,"change":-0.71,"iv":48.87,"rank":1.1,"pct":67.3,"sector":"Mineração"},{"code":"CPFE3","name":"CPFL ENERGIA ON","price":51.34,"change":0.66,"iv":51.58,"rank":8.4,"pct":73.2,"sector":"Bancos"},{"code":"RADL3","name":"RAIADROGASIL ON","price":59.17,"change":2.03,"iv":54.29,"rank":15.7,"pct":79.1,"sector":"Petróleo"},{"code":"NVDC34","name":"NVDC34 ON","price":67.0,"change":3.4,"iv":57.0,"rank":23.0,"pct":85.0,"sector":"Energia"},{"code":"EZTC3","name":"EZTC3 ON","price":74.83,"change":-4.43,"iv":59.71,"rank":30.3,"pct":90.9,"sector":"Varejo"},{"code":"CMIN3","name":"CMIN3 ON","price":82.66,"change":-3.06,"iv":62.42,"rank":37.6,"pct":96.8,"sector":"Tecnologia"},{"code":"LWSA3","name":"LWSA3 ON","price":90.49,"change":-1.69,"iv":65.13,"rank":44.9,"pct":1.7,"sector":"Imobiliário"},{"code":"VIVT3","name":"TELEF BRASIL ON","price":98.32,"change":-0.32,"iv":67.84,"rank":52.2,"pct":7.6,"sector":"Mineração"},{"code":"YDUQ3","name":"YDUQ3 ON","price":106.15,"change":1.05,"iv":70.55,"rank":59.5,"pct":13.5,"sector":"Bancos"},{"code":"DIRR3","name":"DIRR3 ON","price":113.98,"change":2.42,"iv":73.26,"rank":66.8,"pct":19.4,"sector":"Petróleo"},{"code":"RAPT4","name":"RAPT4 ON","price":121.81,"change":3.79,"iv":75.97,"rank":74.1,"pct":25.3,"sector":"Energia"},{"code":"PNVL3","name":"PNVL3 ON","price":9.64,"change":-4.04,"iv":20.68,"rank":81.4,"pct":31.2,"sector":"Varejo"},{"code":"M1TA34","name":"M1TA34 ON","price":17.47,"change":-2.67,"iv":23.39,"rank":88.7,"pct":37.1,"sector":"Tecnologia"},{"code":"GFSA3","name":"GFSA3 ON","price":25.3,"change":-1.3,"iv":26.1,"rank":96.0,"pct":43.0,"sector":"Imobiliário"},{"code":"CBAV3","name":"CBAV3 ON","price":33.13,"change":0.07,"iv":28.81,"rank":2.3,"pct":48.9,"sector":"Mineração"},{"code":"AMZO34","name":"AMZO34 ON","price":40.96,"change":1.44,"iv":31.52,"rank":9.6,"pct":54.8,"sector":"Bancos"},{"code":"SAUD3","name":"SAUD3 ON","price":48.79,"change":2.81,"iv":34.23,"rank":16.9,"pct":60.7,"sector":"Petróleo"},{"code":"ARML3","name":"ARML3 ON","price":56.62,"change":4.18,"iv":36.94,"rank":24.2,"pct":66.6,"sector":"Energia"},{"code":"IGTI11","name":"IGTI11 ON","price":64.45,"change":-3.65,"iv":39.65,"rank":31.5,"pct":72.5,"sector":"Varejo"},{"code":"CURY3","name":"CURY3 ON","price":72.28,"change":-2.28,"iv":42.36,"rank":38.8,"pct":78.4,"sector":"Tecnologia"},{"code":"SMTO3","name":"SMTO3 ON","price":80.11,"change":-0.91,"iv":45.07,"rank":46.1,"pct":84.3,"sector":"Imobiliário"},{"code":"MSFT34","name":"MSFT34 ON","price":87.94,"change":0.46,"iv":47.78,"rank":53.4,"pct":90.2,"sector":"Mineração"},{"code":"POMO4","name":"POMO4 ON","price":95.77,"change":1.83,"iv":50.49,"rank":60.7,"pct":96.1,"sector":"Bancos"},{"code":"TTEN3","name":"TTEN3 ON","price":103.6,"change":3.2,"iv":53.2,"rank":68.0,"pct":1.0,"sector":"Petróleo"},{"code":"MYPK3","name":"MYPK3 ON","price":111.43,"change":-4.63,"iv":55.91,"rank":75.3,"pct":6.9,"sector":"Energia"},{"code":"BRSR6","name":"BRSR6 ON","price":119.26,"change":-3.26,"iv":58.62,"rank":82.6,"pct":12.8,"sector":"Varejo"},{"code":"XPBR31","name":"XPBR31 ON","price":7.09,"change":-1.89,"iv":61.33,"rank":89.9,"pct":18.7,"sector":"Tecnologia"},{"code":"GMAT3","name":"GMAT3 ON","price":14.92,"change":-0.52,"iv":64.04,"rank":97.2,"pct":24.6,"sector":"Imobiliário"},{"code":"RECV3","name":"RECV3 ON","price":22.75,"change":0.85,"iv":66.75,"rank":3.5,"pct":30.5,"sector":"Mineração"},{"code":"TSMC34","name":"TSMC34 ON","price":30.58,"change":2.22,"iv":69.46,"rank":10.8,"pct":36.4,"sector":"Bancos"},{"code":"SLCE3","name":"SLCE3 ON","price":38.41,"change":3.59,"iv":72.17,"rank":18.1,"pct":42.3,"sector":"Petróleo"},{"code":"AURE3","name":"AURE3 ON","price":46.24,"change":-4.24,"iv":74.88,"rank":25.4,"pct":48.2,"sector":"Energia"},{"code":"ANIM3","name":"ANIM3 ON","price":54.07,"change":-2.87,"iv":19.59,"rank":32.7,"pct":54.1,"sector":"Varejo"},{"code":"TUPY3","name":"TUPY3 ON","price":61.9,"change":-1.5,"iv":22.3,"rank":40.0,"pct":60.0,"sector":"Tecnologia"},{"code":"ALPA4","name":"ALPA4 ON","price":69.73,"change":-0.13,"iv":25.01,"rank":47.3,"pct":65.9,"sector":"Imobiliário"},{"code":"LEVE3","name":"LEVE3 ON","price":77.56,"change":1.24,"iv":27.72,"rank":54.6,"pct":71.8,"sector":"Mineração"},{"code":"UNIP6","name":"UNIP6 ON","price":85.39,"change":2.61,"iv":30.43,"rank":61.9,"pct":77.7,"sector":"Bancos"},{"code":"LJQQ3","name":"LJQQ3 ON","price":93.22,"change":3.98,"iv":33.14,"rank":69.2,"pct":83.6,"sector":"Petróleo"},{"code":"INTB3","name":"INTB3 ON","price":101.05,"change":-3.85,"iv":35.85,"rank":76.5,"pct":89.5,"sector":"Energia"},{"code":"SOJA3","name":"SOJA3 ON","price":108.88,"change":-2.48,"iv":38.56,"rank":83.8,"pct":95.4,"sector":"Varejo"},{"code":"BMOB3","name":"BMOB3 ON","price":116.71,"change":-1.11,"iv":41.27,"rank":91.1,"pct":0.3,"sector":"Tecnologia"},{"code":"POSI3","name":"POSI3 ON","price":4.54,"change":0.26,"iv":43.98,"rank":98.4,"pct":6.2,"sector":"Imobiliário"},{"code":"DXCO3","name":"DXCO3 ON","price":12.37,"change":1.63,"iv":46.69,"rank":4.7,"pct":12.1,"sector":"Mineração"},{"code":"KEPL3","name":"KEPL3 ON","price":20.2,"change":3.0,"iv":49.4,"rank":12.0,"pct":18.0,"sector":"Bancos"},{"code":"GRND3","name":"GRND3 ON","price":28.03,"change":4.37,"iv":52.11,"rank":19.3,"pct":23.9,"sector":"Petróleo"},{"code":"VULC3","name":"VULC3 ON","price":35.86,"change":-3.46,"iv":54.82,"rank":26.6,"pct":29.8,"sector":"Energia"},{"code":"SPCX34","name":"SPCX34 ON","price":43.69,"change":-2.09,"iv":57.53,"rank":33.9,"pct":35.7,"sector":"Varejo"},{"code":"MDNE3","name":"MDNE3 ON","price":51.52,"change":-0.72,"iv":60.24,"rank":41.2,"pct":41.6,"sector":"Tecnologia"},{"code":"TSLA34","name":"TSLA34 ON","price":59.35,"change":0.65,"iv":62.95,"rank":48.5,"pct":47.5,"sector":"Imobiliário"},{"code":"ALUP11","name":"ALUP11 ON","price":67.18,"change":2.02,"iv":65.66,"rank":55.8,"pct":53.4,"sector":"Mineração"},{"code":"RIAA3","name":"RIAA3 ON","price":75.01,"change":3.39,"iv":68.37,"rank":63.1,"pct":59.3,"sector":"Bancos"},{"code":"ITLC34","name":"ITLC34 ON","price":82.84,"change":-4.44,"iv":71.08,"rank":70.4,"pct":65.2,"sector":"Petróleo"},{"code":"CPLE99","name":"CPLE99 ON","price":90.67,"change":-3.07,"iv":73.79,"rank":77.7,"pct":71.1,"sector":"Energia"},{"code":"WIZC3","name":"WIZC3 ON","price":98.5,"change":-1.7,"iv":18.5,"rank":85.0,"pct":77.0,"sector":"Varejo"},{"code":"HBOR3","name":"HBOR3 ON","price":106.33,"change":-0.33,"iv":21.21,"rank":92.3,"pct":82.9,"sector":"Tecnologia"},{"code":"BMGB4","name":"BMGB4 ON","price":114.16,"change":1.04,"iv":23.92,"rank":99.6,"pct":88.8,"sector":"Imobiliário"},{"code":"AMBP3","name":"AMBP3 ON","price":121.99,"change":2.41,"iv":26.63,"rank":5.9,"pct":94.7,"sector":"Mineração"},{"code":"PCAR3","name":"PCAR3 ON","price":9.82,"change":3.78,"iv":29.34,"rank":13.2,"pct":100.6,"sector":"Bancos"}];
const BRAPI_BASE = "https://brapi.dev/api/v2";
const TOKEN_KEY = "b3options_brapi_token";
const getToken = () => sessionStorage.getItem(TOKEN_KEY) || "";
const $ = id => document.getElementById(id);

const fmt = (x, d=2) => Number(x || 0).toLocaleString("pt-BR", {
  minimumFractionDigits:d, maximumFractionDigits:d
});
const money = x => (x < 0 ? "-R$ " : "R$ ") + Math.abs(Number(x || 0)).toLocaleString("pt-BR", {
  minimumFractionDigits:2, maximumFractionDigits:4
});
const parseBR = v => Number(String(v ?? "").replace(/\s/g,"").replace(/\./g,"").replace(",", ".")) || 0;
const pct = x => (Number(x || 0) >= 0 ? "+" : "") + Number(x || 0).toFixed(2).replace(".", ",") + "%";

async function api(path, params={}) {
  const u = new URL(BRAPI_BASE + path);
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;
  const r = await fetch(u.toString(), {headers, cache:"no-store"});
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
  return data;
}

function setDataStatus(text, ok=true) {
  document.querySelectorAll("[data-source-status]").forEach(el => {
    el.textContent = text;
    el.classList.toggle("error", !ok);
  });
}

function configureToken() {
  const current = getToken();
  const value = prompt(
    "Cole o token da brapi.dev.\n\n" +
    "Sem token, o sandbox da brapi permite apenas alguns ativos para teste. " +
    "Com token, o site pode consultar os recursos liberados pelo seu plano.\n\n" +
    "Deixe vazio para remover o token.",
    current
  );
  if (value === null) return;
  if (value.trim()) sessionStorage.setItem(TOKEN_KEY, value.trim());
  else sessionStorage.removeItem(TOKEN_KEY);
  location.reload();
}
window.configureBrapiToken = configureToken;

async function getQuotes(symbols) {
  const data = await api("/stocks/quote", {symbols:symbols.join(",")});
  return data.results || [];
}
async function getQuote(symbol) {
  const r = await getQuotes([symbol]);
  return r[0] || null;
}
async function getExpirations(symbol) {
  const data = await api("/options/expirations", {underlying:symbol});
  return data.expirations || [];
}
async function getChain(symbol, expiration, side) {
  const p = {underlying:symbol, expirationDate:expiration};
  if (side) p.side = side.toLowerCase();
  const data = await api("/options/chain", p);
  return data.series || [];
}

const ASSETS = FALLBACK_ASSETS.map(x => ({...x}));
let list = [...ASSETS], n = 40, current = null;

function initIndex() {
  if (!$("cards")) return;
  const sectors = [...new Set(ASSETS.map(x => x.sector))].sort();
  $("sector").innerHTML = '<option>Todos os setores</option>' +
    sectors.map(x => `<option>${x}</option>`).join("");
  renderIndex();
  refreshIndexQuotes();
}

async function refreshIndexQuotes() {
  try {
    const symbols = ASSETS.slice(0, 20).map(x => x.code);
    const results = await getQuotes(symbols);
    const map = new Map(results.map(r => [r.symbol, r]));
    ASSETS.forEach(a => {
      const q = map.get(a.code);
      if (!q) return;
      const d = q.data || q;
      if (Number.isFinite(Number(d.regularMarketPrice))) a.price = Number(d.regularMarketPrice);
      if (Number.isFinite(Number(d.regularMarketChangePercent))) a.change = Number(d.regularMarketChangePercent);
      a.marketTime = d.regularMarketTime || q.regularMarketTime || null;
      a.real = true;
    });
    renderIndex();
    setDataStatus("Dados: brapi.dev", true);
  } catch (e) {
    setDataStatus("Dados demonstrativos — configure o token da brapi", false);
  }
}

function renderIndex() {
  if (!$("cards")) return;
  const q = ($("q")?.value || "").toUpperCase();
  const sec = $("sector")?.value || "Todos os setores";
  const sort = $("sort")?.value || "rank";
  list = ASSETS.filter(x =>
    (!q || (x.code+" "+x.name).toUpperCase().includes(q)) &&
    (sec === "Todos os setores" || x.sector === sec)
  );
  list.sort((a,b) =>
    sort === "code" ? a.code.localeCompare(b.code) :
    sort === "price" ? b.price-a.price :
    sort === "change" ? b.change-a.change :
    sort === "iv" ? b.iv-a.iv : b.rank-a.rank
  );
  const visible = list.slice(0,n);
  $("cards").innerHTML = visible.map(x => `
    <article class="card" onclick="openM('${x.code}')">
      <div class="ctop">
        <div><div class="ticker">${x.code}</div><div class="company">${x.name}</div></div>
        <button class="star" onclick="event.stopPropagation()">☆</button>
      </div>
      <div class="row"><b>${money(x.price)}</b><i class="${x.change>=0?'up':'down'}">${pct(x.change)}</i></div>
      <div class="metrics">
        <div class="metric"><span>IV</span><b>${fmt(x.iv,1)}%</b></div>
        <div class="metric"><span>HV</span><b>${fmt(x.iv*.88,1)}%</b></div>
        <div class="metric"><span>IV Rank</span><b>${fmt(x.rank,0)}</b></div>
        <div class="metric"><span>Percentil</span><b>${fmt(x.pct,0)}%</b></div>
      </div>
      <div class="bar"><i style="width:${Math.max(8,Math.min(100,x.pct))}%"></i></div>
      <div class="bottom"><span>${x.real ? "Cotação real" : "Aguardando dados"}</span><span>${x.sector}</span></div>
    </article>
  `).join("");
  $("count").textContent = `${list.length} ativos na lista · dados reais são carregados quando disponíveis`;
  $("more").style.display = n < list.length ? "block" : "none";
}
function more(){ n += 40; renderIndex(); }
function reset(){ $("q").value=""; $("sector").selectedIndex=0; $("sort").value="rank"; n=40; renderIndex(); }
function focusSearch(){ $("q").focus(); scrollTo({top:$("cards").offsetTop-80,behavior:"smooth"}); }
window.more=more; window.reset=reset; window.focusSearch=focusSearch;

async function openM(code) {
  current = ASSETS.find(x=>x.code===code);
  if (!current) return;
  $("mt").textContent = current.code + " · " + current.name;
  $("mp").textContent = money(current.price);
  $("mc").textContent = pct(current.change);
  $("mc").className = current.change>=0 ? "up" : "down";
  $("ms").innerHTML = [
    ["Preço", money(current.price)],
    ["Variação", pct(current.change)],
    ["IV", fmt(current.iv,2)+"%"],
    ["IV Rank", fmt(current.rank,2)],
    ["IV Percentil", fmt(current.pct,2)]
  ].map(([a,b]) => `<div>${a}<b>${b}</b></div>`).join("");
  $("std").textContent = fmt(current.iv*.62,2)+"%";
  $("iv").textContent = fmt(current.iv,2)+"%";
  $("rk").textContent = fmt(current.rank,2);
  $("pc").textContent = fmt(current.pct,2);
  $("modal").classList.add("show");
  document.body.style.overflow="hidden";
  try {
    const exps = await getExpirations(current.code);
    await renderMarketSeries(current, exps);
  } catch (e) {
    $("pills").innerHTML = `<span class="pill">Não foi possível consultar a cadeia: ${e.message}</span>`;
    $("tb").innerHTML = "";
  }
}
window.openM=openM;

async function renderMarketSeries(asset, expirations) {
  const exp = expirations[0];
  if (!exp) { $("pills").innerHTML="Nenhum vencimento retornado."; $("tb").innerHTML=""; return; }
  $("pills").innerHTML = expirations.slice(0,10).map((d,i) =>
    `<button class="pill ${i===0?'on':''}" data-exp="${d}">${new Date(d+"T12:00:00").toLocaleDateString("pt-BR")}</button>`
  ).join("");
  $("pills").querySelectorAll(".pill").forEach(b => b.onclick = async () => {
    $("pills").querySelectorAll(".pill").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    await fillMarketChain(asset, b.dataset.exp);
  });
  await fillMarketChain(asset, exp);
}
async function fillMarketChain(asset, exp) {
  try {
    const series = await getChain(asset.code, exp);
    const calls = new Map(series.filter(x=>x.side==="call").map(x=>[Number(x.strike),x]));
    const puts = new Map(series.filter(x=>x.side==="put").map(x=>[Number(x.strike),x]));
    const strikes = [...new Set([...calls.keys(),...puts.keys()])].sort((a,b)=>a-b);
    $("tb").innerHTML = strikes.map(k => {
      const c=calls.get(k), p=puts.get(k);
      const last = x => x ? (x.close ?? x.average ?? 0) : 0;
      return `<tr>
        <td class="code">${c?.symbol||"—"}</td><td>${c?money(last(c)):"—"}</td><td>${c?.delta ?? "—"}</td><td>${c?.trades ?? "—"}</td><td>${c?.impliedVolatility ? fmt(c.impliedVolatility*100,2)+"%" : "—"}</td><td>${c?money(c.ask||0):"—"}</td>
        <td class="strike">${money(k)}</td>
        <td>${p?money(p.bid||0):"—"}</td><td>${p?.impliedVolatility ? fmt(p.impliedVolatility*100,2)+"%" : "—"}</td><td>${p?.trades ?? "—"}</td><td>${p?.delta ?? "—"}</td><td>${p?money(last(p)):"—"}</td><td class="code">${p?.symbol||"—"}</td>
      </tr>`;
    }).join("");
  } catch(e) {
    $("tb").innerHTML = `<tr><td colspan="13">${e.message}</td></tr>`;
  }
}
function closeM(){ $("modal").classList.remove("show"); document.body.style.overflow=""; }
function tab(i,b){
  document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("on")); b.classList.add("on");
  $("series").classList.toggle("hidden",i!==0); $("overview").classList.toggle("hidden",i!==1); $("flow").classList.toggle("hidden",i!==2);
}
window.closeM=closeM; window.tab=tab;

$("q")?.addEventListener("input",()=>{n=40;renderIndex()});
$("sector")?.addEventListener("change",()=>{n=40;renderIndex()});
$("sort")?.addEventListener("change",()=>{n=40;renderIndex()});
document.addEventListener("keydown",e=>{if(e.key==="Escape" && $("modal")) closeM()});

/* ---------- Simulador ---------- */
let selectedAsset = ASSETS.find(x=>x.code==="BOVA11") || ASSETS[0];
let optionSeries = [];
let rows = [];
let mode = "expiry";
let expiries = [];

function nextFallbackFridays(n=12) {
  const out=[], d=new Date(); d.setHours(12,0,0,0);
  while(out.length<n){ d.setDate(d.getDate()+1); if(d.getDay()===5) out.push(new Date(d)); }
  return out;
}
function iso(d){ return d.toISOString().slice(0,10); }
function dmy(s){ return new Date(s+"T12:00:00").toLocaleDateString("pt-BR"); }
function businessDaysFromNow(s) {
  let d=new Date(); d.setHours(12,0,0,0);
  const t=new Date(s+"T12:00:00"); let c=0;
  while(d<t){d.setDate(d.getDate()+1); if(d.getDay()>0&&d.getDay()<6)c++;}
  return c;
}
function expiryOptions(selected){
  return expiries.map(d=>`<option value="${d}" ${d===selected?"selected":""}>${dmy(d)} · ${businessDaysFromNow(d)} d.u.</option>`).join("");
}
function currentSideSeries(type) {
  const side = type==="CALL" ? "call" : "put";
  return optionSeries.filter(x=>x.side===side).sort((a,b)=>Number(a.strike)-Number(b.strike));
}
function strikeOptions(selected,type){
  const arr=currentSideSeries(type);
  if (!arr.length) return `<option value="">Sem strikes carregados</option>`;
  return arr.map(x=>`<option value="${x.strike}" ${Math.abs(Number(x.strike)-Number(selected))<.0001?"selected":""}>${fmt(x.strike,2)}</option>`).join("");
}
function closestStrike(v,type="CALL"){
  const a=currentSideSeries(type).map(x=>Number(x.strike));
  if(!a.length) return Number(v)||0;
  return a.reduce((p,c)=>Math.abs(c-v)<Math.abs(p-v)?c:p,a[0]);
}
function findSeries(type,strike){
  const side=type==="CALL"?"call":"put";
  return optionSeries.find(x=>x.side===side && Math.abs(Number(x.strike)-Number(strike))<.0001);
}
function optionPremium(r){
  const s=findSeries(r.type,r.strike);
  if(s) return Number(s.close ?? s.average ?? s.lastPrice ?? 0) || 0;
  const S=parseBR($("spot").value),K=Number(r.strike),E=new Date(r.expiry+"T12:00:00"),now=new Date();
  const T=Math.max(0,(E-now)/86400000/365),sig=parseBR($("vol").value)/100,rate=parseBR($("rate").value)/100;
  return bs(S,K,T,sig,rate,r.type);
}
function bs(S,K,T,sigma,r,type){
  if(T<=0) return type==="CALL"?Math.max(S-K,0):Math.max(K-S,0);
  if(sigma<=0) return type==="CALL"?Math.max(S-K*Math.exp(-r*T),0):Math.max(K*Math.exp(-r*T)-S,0);
  const d1=(Math.log(S/K)+(r+sigma*sigma/2)*T)/(sigma*Math.sqrt(T)), d2=d1-sigma*Math.sqrt(T);
  return type==="CALL" ? S*N(d1)-K*Math.exp(-r*T)*N(d2) : K*Math.exp(-r*T)*N(-d2)-S*N(-d1);
}
function erf(x){const s=x<0?-1:1;x=Math.abs(x);const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911,t=1/(1+p*x);return s*(1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x))}
function N(x){return .5*(1+erf(x/Math.sqrt(2)))}

async function loadSimulatorMarket() {
  const symbol=$("asset").value;
  selectedAsset=ASSETS.find(x=>x.code===symbol)||selectedAsset;
  try {
    const q=await getQuote(symbol);
    if(q){
      const d=q.data||q;
      if(Number.isFinite(Number(d.regularMarketPrice))) selectedAsset.price=Number(d.regularMarketPrice);
      if(Number.isFinite(Number(d.regularMarketChangePercent))) selectedAsset.change=Number(d.regularMarketChangePercent);
      selectedAsset.name=d.shortName||d.longName||selectedAsset.name;
      selectedAsset.real=true;
    }
    expiries=await getExpirations(symbol);
    if(!expiries.length) throw new Error("Nenhum vencimento retornado para este ativo.");
    $("expiry").innerHTML=expiryOptions(expiries[0]);
    await loadChain();
    $("spot").value=fmt(selectedAsset.price,2);
    $("assetName").textContent=selectedAsset.name;
    $("assetVol").textContent=selectedAsset.iv ? fmt(selectedAsset.iv,2)+"%" : "—";
    $("assetSector").textContent=selectedAsset.sector||"—";
    setDataStatus("Mercado: dados da brapi · opções EOD", true);
  } catch(e) {
    expiries=nextFallbackFridays().map(iso);
    $("expiry").innerHTML=expiryOptions(expiries[0]);
    optionSeries=[];
    $("spot").value=fmt(selectedAsset.price,2);
    $("assetName").textContent=selectedAsset.name;
    $("assetVol").textContent="—";
    $("assetSector").textContent=selectedAsset.sector||"—";
    setDataStatus("Mercado: sem dados reais para este ativo — "+e.message, false);
  }
  rows.forEach(r=>{
    if(r.type!=="ATIVO"){
      r.expiry=$("expiry").value;
      r.strike=closestStrike(r.strike,r.type);
      r.premium=optionPremium(r);
    } else r.entry=parseBR($("spot").value);
  });
  renderSim();
}
async function loadChain() {
  const symbol=$("asset").value, exp=$("expiry").value;
  if(!symbol || !exp) return;
  try {
    optionSeries=await getChain(symbol,exp);
    if(!optionSeries.length) throw new Error("A cadeia não retornou séries negociadas.");
    rows.forEach(r=>{
      if(r.type!=="ATIVO"){r.expiry=exp;r.strike=closestStrike(r.strike,r.type);r.premium=optionPremium(r);}
    });
  } catch(e) {
    optionSeries=[];
    setDataStatus("Opções: " + e.message, false);
  }
}
function initSimulator(){
  if(!$("legs")) return;
  $("asset").innerHTML=ASSETS.map(a=>`<option value="${a.code}">${a.code} — ${a.name}</option>`).join("");
  $("asset").value=selectedAsset.code;
  expiries=nextFallbackFridays().map(iso);
  $("expiry").innerHTML=expiryOptions(expiries[0]);
  $("asset").addEventListener("change",loadSimulatorMarket);
  $("expiry").addEventListener("change",async()=>{
    await loadChain(); rows.forEach(r=>{if(r.type!=="ATIVO"){r.expiry=$("expiry").value;r.strike=closestStrike(r.strike,r.type);r.premium=optionPremium(r)}}); renderSim();
  });
  $("spot").addEventListener("input",()=>{rows.forEach(r=>{if(r.type==="ATIVO")r.entry=parseBR($("spot").value)});calcSim()});
  $("vol").addEventListener("input",()=>{rows.forEach(r=>{if(r.type!=="ATIVO")r.premium=optionPremium(r)});calcSim()});
  $("rate").addEventListener("input",calcSim);
  $("addCall").onclick=()=>addLeg("CALL","Compra");
  $("addPut").onclick=()=>addLeg("PUT","Venda");
  $("addAsset").onclick=()=>addLeg("ATIVO","Compra");
  $("clear").onclick=()=>{rows=[];renderSim()};
  $("example").onclick=async()=>{rows=[];addLeg("ATIVO","Compra");addLeg("CALL","Compra");addLeg("PUT","Venda");};
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");mode=b.dataset.mode;calcSim()});
  loadSimulatorMarket();
}
function uid(){return "r"+Date.now()+Math.random().toString(16).slice(2)}
function addLeg(type="CALL",side="Compra",qty=1000){
  const r={id:uid(),type,side,qty,expiry:$("expiry").value,strike:0,premium:0};
  if(type==="ATIVO"){r.entry=parseBR($("spot").value);}
  else {r.strike=closestStrike(parseBR($("spot").value),type);r.premium=optionPremium(r);}
  rows.push(r);renderSim();
}
function renderSim(){
  $("legs").innerHTML=rows.map(r=>{
    const isAsset=r.type==="ATIVO", s=findSeries(r.type,r.strike);
    const code=isAsset?selectedAsset.code:(s?.symbol||"—");
    const price=isAsset?r.entry:r.premium;
    return `<tr class="${isAsset?'asset-row':''}">
      <td><button data-del="${r.id}" title="Excluir">×</button></td>
      <td><select data-k="side" data-id="${r.id}"><option ${r.side==="Compra"?"selected":""}>Compra</option><option ${r.side==="Venda"?"selected":""}>Venda</option></select></td>
      <td><input data-k="qty" data-id="${r.id}" inputmode="numeric" value="${r.qty}"></td>
      <td><select data-k="type" data-id="${r.id}"><option ${r.type==="ATIVO"?"selected":""}>ATIVO</option><option ${r.type==="CALL"?"selected":""}>CALL</option><option ${r.type==="PUT"?"selected":""}>PUT</option></select></td>
      <td><select data-k="expiry" data-id="${r.id}" ${isAsset?"disabled":""}>${expiryOptions(r.expiry)}</select></td>
      <td>${isAsset?'<span class="readonly">—</span>':`<select data-k="strike" data-id="${r.id}">${strikeOptions(r.strike,r.type)}</select>`}</td>
      <td><input class="readonly" value="${code}" readonly></td>
      <td><input data-k="${isAsset?'entry':'premium'}" data-id="${r.id}" inputmode="decimal" value="${fmt(price,isAsset?2:4)}"></td>
    </tr>`;
  }).join("");
  calcSim();
}
$("legs")?.addEventListener("change",async e=>{
  const id=e.target.dataset.id,k=e.target.dataset.k;if(!id||!k)return;
  const r=rows.find(x=>x.id===id);if(!r)return;
  if(k==="side"||k==="type"||k==="expiry") r[k]=e.target.value;
  else if(k==="qty") r.qty=Math.max(1,Math.round(parseBR(e.target.value)));
  else if(k==="strike") r.strike=Number(e.target.value);
  else if(k==="premium"||k==="entry") r[k]=parseBR(e.target.value);
  if(k==="type"){
    if(r.type==="ATIVO") r.entry=parseBR($("spot").value);
    else {r.strike=closestStrike(r.strike,r.type);r.premium=optionPremium(r);}
  }
  if(k==="expiry" && r.type!=="ATIVO"){r.expiry=e.target.value;await loadChain();r.strike=closestStrike(r.strike,r.type);r.premium=optionPremium(r);}
  if(k==="strike" && r.type!=="ATIVO") r.premium=optionPremium(r);
  renderSim();
});
$("legs")?.addEventListener("input",e=>{
  const id=e.target.dataset.id,k=e.target.dataset.k;if(!id||!k)return;
  const r=rows.find(x=>x.id===id);if(!r)return;
  if(k==="qty")r.qty=Math.max(1,Math.round(parseBR(e.target.value)));
  if(k==="premium")r.premium=parseBR(e.target.value);
  if(k==="entry")r.entry=parseBR(e.target.value);
  calcSim();
});
$("legs")?.addEventListener("click",e=>{
  const id=e.target.dataset.del;if(id){rows=rows.filter(r=>r.id!==id);renderSim();}
});
function payoff(S,t){
  let total=0;
  for(const r of rows){
    const side=r.side==="Compra"?1:-1;
    let pnl=0;
    if(r.type==="ATIVO") pnl=(S-r.entry)*r.qty;
    else {
      const intrinsic=r.type==="CALL"?Math.max(S-r.strike,0):Math.max(r.strike-S,0);
      const val=t<=0?intrinsic:bs(S,r.strike,t,parseBR($("vol").value)/100,parseBR($("rate").value)/100,r.type);
      pnl=side*(val-r.premium)*r.qty;
    }
    if(r.type==="ATIVO") pnl*=side;
    total+=pnl;
  }
  return total;
}
function calcSim(){
  if(!$("chart")) return;
  const S=parseBR($("spot").value)||1,E=new Date(($("expiry").value||expiries[0])+"T12:00:00"),now=new Date();
  let T=Math.max(0,(E-now)/86400000/365);
  if(mode==="expiry")T=0; else if(mode==="7d")T=Math.max(0,T-7/365); else if(mode==="30d")T=Math.max(0,T-30/365);
  const strikes=rows.map(r=>r.strike).filter(Boolean),center=S||strikes[0]||20;
  const minX=Math.max(.01,Math.min(...(strikes.length?strikes:[center]))*.55),maxX=Math.max(...(strikes.length?strikes:[center]))*1.45;
  const xs=[],ys=[];for(let i=0;i<121;i++){const x=minX+(maxX-minX)*i/120;xs.push(x);ys.push(payoff(x,T))}
  $("pnlNow").textContent=money(payoff(S,T));$("max").textContent=money(Math.max(...ys));$("min").textContent=money(Math.min(...ys));
  const bes=[];for(let i=1;i<ys.length;i++)if(ys[i-1]===0||ys[i]===0||(ys[i-1]<0)!=(ys[i]<0)){const den=ys[i]-ys[i-1];bes.push(den?xs[i-1]+(xs[i]-xs[i-1])*(0-ys[i-1])/den:xs[i])}
  $("be").textContent=bes.length?bes.map(x=>fmt(x,2)).join(" · "):"—";
  const c=$("chart"),ctx=c.getContext("2d"),w=c.width=c.clientWidth*devicePixelRatio,h=c.height=c.clientHeight*devicePixelRatio;ctx.clearRect(0,0,w,h);
  const pad=45*devicePixelRatio, minY=Math.min(...ys),maxY=Math.max(...ys),rx=x=>pad+(x-minX)/(maxX-minX)*(w-2*pad),ry=y=>h-pad-(y-minY)/(maxY-minY||1)*(h-2*pad);
  ctx.strokeStyle="#24313d";ctx.lineWidth=1;for(let i=0;i<6;i++){const y=pad+i*(h-2*pad)/5;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}
  ctx.strokeStyle="#8fc7ff";ctx.lineWidth=2.5*devicePixelRatio;ctx.beginPath();xs.forEach((x,i)=>i?ctx.lineTo(rx(x),ry(ys[i])):ctx.moveTo(rx(x),ry(ys[i])));ctx.stroke();
}
initIndex();
initSimulator();
