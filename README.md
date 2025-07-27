# 🚀 Universal Project Builder v2.0

Un sistema modulare completo per gestione, organizzazione e generazione progetti da codice incollato.

## 🎯 Panoramica

Universal Project Builder è la versione 2.0 evoluta che unifica e migliora:

1. **Il tuo Code File Generator** esistente (estrazione file da codice)
2. **Sistema di organizzazione file** con configurazione JSON
3. **Generatore progetti Android** completo
4. **Generatore progetti Web** (HTML/CSS/JS/React)
5. **Sistema modulare** facilmente estendibile

## ✨ Caratteristiche Principali

### 🔍 Code Extractor
- **Estrazione intelligente** file da codice con intestazioni numeriche
- **Auto-rilevamento linguaggio** (Kotlin, Java, JavaScript, HTML, CSS, JSON, XML)
- **Validazione sintassi** opzionale
- **Generazione configurazione** automatica
- **Statistiche dettagliate** sui file estratti

### 📁 File Organizer  
- **Organizzazione tramite JSON** con regole personalizzabili
- **Operazioni supportate**: rinomina, sposta, copia, unisci, dividi file
- **Validazione configurazione** con errori e avvisi
- **Simulazione (dry-run)** prima dell'applicazione
- **Report dettagliato** delle operazioni

### 🤖 Android Builder
- **Progetti Android Studio** completi e funzionali
- **Gradle configurazione** automatica
- **AndroidManifest.xml** generazione
- **Activities e Layout** multipli
- **Struttura cartelle** standard Android

### 🌐 Web Builder
- **Progetti web** (Vanilla, React, Vue, Angular)
- **CSS Framework** integration (Bootstrap, Tailwind)
- **Package.json** e configurazioni
- **Struttura componenti** moderna
- **PWA support** opzionale

### 📦 Workflow Engine
- **Workflow predefiniti** per diversi tipi di progetto
- **Esecuzione step-by-step** con logging
- **Rollback e recovery** in caso di errori
- **Report utilizzo** dettagliato

## 🏗️ Architettura Modulare

```
UniversalProjectBuilder/
├── index.html              # UI principale
├── server.py              # Server HTTP locale (risolve CORS)
├── css/                   # Stili modulari
│   ├── main.css          # Stili principali
│   ├── components.css    # Componenti UI
│   ├── themes.css        # Temi e variazioni
│   └── responsive.css    # Media queries
├── js/
│   ├── app.js           # Applicazione principale
│   ├── core/            # Moduli core
│   │   ├── CodeExtractor.js
│   │   ├── FileOrganizer.js
│   │   ├── ProjectGenerator.js
│   │   └── UIManager.js
│   ├── modules/         # Moduli specializzati
│   │   ├── AndroidBuilder.js
│   │   ├── WebBuilder.js
│   │   └── ZipBuilder.js
│   ├── templates/       # Template per progetti
│   │   ├── android.js
│   │   ├── web.js
│   │   └── generic.js
│   └── utils/          # Utility condivise
│       ├── helpers.js
│       ├── validators.js
│       └── constants.js
├── templates/           # Configurazioni predefinite
│   ├── android-config.json
│   ├── web-config.json
│   └── generic-config.json
└── lib/                # Librerie esterne
    └── jszip.min.js
```

## 🚀 Quick Start

### Metodo 1: Server HTTP (RACCOMANDATO)
```bash
# Estrai tutti i file nella cartella UniversalProjectBuilder/
# Esegui il server Python
python server.py

# Oppure manualmente:
python -m http.server 8000
```
Poi apri: `http://localhost:8000`

### Metodo 2: Live Server (VS Code)
1. Installa estensione "Live Server"
2. Click destro su `index.html` → "Open with Live Server"

### ⚠️ IMPORTANTE
**NON aprire `index.html` direttamente nel browser!**
I moduli ES6 richiedono un server HTTP per funzionare.

## 📋 Guide d'Uso

### 1. Code Extractor

Incolla codice con formato:
```
1. MainActivity.kt
class MainActivity : AppCompatActivity() {
    // codice...
}

2. activity_main.xml
<?xml version="1.0"?>
<!-- layout... -->

3. build.gradle
android {
    // configurazione...
}
```

**Caratteristiche:**
- ✅ Auto-rileva linguaggio e estensione
- ✅ Pulisce marcatori di linguaggio automaticamente
- ✅ Genera statistiche complete
- ✅ Crea configurazione JSON per organizzazione

### 2. File Organizer

Carica file e usa configurazioni JSON per organizzarli:

```json
{
  "projectName": "MyAndroidApp",
  "fileRenames": {
    "OldName.kt": "NewName.kt"
  },
  "folderMappings": {
    "MainActivity.kt": "app/src/main/java/com/example/app",
    "activity_main.xml": "app/src/main/res/layout"
  },
  "copyToMultipleLocations": {
    "Constants.kt": [
      "core/Constants.kt",
      "utils/AppConstants.kt"
    ]
  }
}
```

**Operazioni supportate:**
- 📝 **fileRenames**: Rinomina file
- 📁 **folderMappings**: Sposta in cartelle
- 🔄 **extensionChanges**: Cambia estensioni
- ✏️ **contentUpdates**: Modifica contenuto (package, import)
- 📄 **copyToMultipleLocations**: Copia in più posizioni
- 🔗 **mergeFiles**: Unisci file multipli
- ✂️ **splitFiles**: Dividi file per classi/funzioni

### 3. Android Builder

Genera progetti Android Studio completi:

**Input:**
- Nome app e package
- Versioni Gradle/Kotlin
- Activities da generare (MainActivity, LoginActivity, etc.)
- File Kotlin/Java esistenti

**Output:**
- Struttura cartelle Android standard
- `build.gradle` configurato
- `AndroidManifest.xml` completo
- Activities con layout corrispondenti
- File risorse (`strings.xml`, `colors.xml`)
- Icone app (adaptive icons)

### 4. Web Builder

Genera progetti web moderni:

**Tipi supportati:**
- Vanilla HTML/CSS/JS
- React App
- Vue.js App
- Angular App

**Features:**
- CSS Framework integration
- Package.json automatico
- Webpack/Vite config
- Routing setup
- PWA support

## 🔧 Configurazioni Avanzate

### Template Android
```json
{
  "projectName": "MyAndroidApp",
  "folderMappings": {
    "MainActivity.kt": "app/src/main/java/com/example/app",
    "User.kt": "app/src/main/java/com/example/app/data/model",
    "UserRepository.kt": "app/src/main/java/com/example/app/data/repository",
    "activity_main.xml": "app/src/main/res/layout"
  },
  "contentUpdates": {
    "MainActivity.kt": {
      "updatePackage": "com.example.app",
      "addImports": [
        "androidx.appcompat.app.AppCompatActivity",
        "android.os.Bundle"
      ]
    }
  }
}
```

### Template Web React
```json
{
  "projectName": "MyReactApp",
  "folderMappings": {
    "App.js": "src/components",
    "Header.jsx": "src/components",
    "main.css": "src/styles",
    "api.js": "src/services"
  },
  "fileRenames": {
    "app.js": "App.js",
    "style.css": "main.css"
  }
}
```

## 🎛️ Workflow Predefiniti

### 1. Code to Files
```
extract → organize → download
```
Estrai file da codice → Applica configurazione → Scarica ZIP

### 2. Android Project
```
extract → validate_android → generate_android → package
```
Estrai file → Valida per Android → Genera progetto → Crea ZIP

### 3. Web Project
```
extract → validate_web → generate_web → package
```
Estrai file → Valida per web → Genera progetto → Crea ZIP

### 4. Custom Organization
```
load_files → apply_config → validate → export
```
Carica file → Applica configurazione → Valida → Esporta

## 🔍 API e Estensibilità

### Aggiungere Nuovo Modulo
```javascript
// js/modules/MyCustomBuilder.js
export class MyCustomBuilder {
    constructor() {
        console.log('🔧 MyCustomBuilder initialized');
    }
    
    async generateProject(config) {
        // Logica di generazione
        return generatedProject;
    }
}

// In app.js
import { MyCustomBuilder } from './modules/MyCustomBuilder.js';
this.myCustomBuilder = new MyCustomBuilder();
```

### Aggiungere Nuovo Template
```javascript
// js/templates/mytemplate.js
export const MyTemplate = {
    projectStructure: () => `...`,
    configFile: () => `...`
};
```

### Aggiungere Workflow Personalizzato
```javascript
this.workflows.myCustomWorkflow = {
    name: 'My Custom Workflow',
    steps: ['step1', 'step2', 'step3'],
    description: 'Workflow personalizzato'
};
```

## 🛠️ Sviluppo e Debugging

### Debug Mode
```javascript
// In console browser
app.getApplicationStats()  // Statistiche app
app.state                 // Stato corrente
app.codeExtractor.getStats()  // Statistiche estrazione
```

### Log delle Operazioni
```javascript
// Workflow history
app.state.workflowHistory

// File operations log
app.fileOrganizer.organizationLog
```

### Performance Monitoring
```javascript
// Memory usage
app.estimateMemoryUsage()

// Session duration
app.calculateSessionDuration()
```

## 🐛 Risoluzione Problemi

### CORS Error
- ✅ Usa sempre un server HTTP
- ❌ Non aprire `file://` direttamente

### Moduli non caricano
- ✅ Verifica che il browser supporti ES6 modules
- ✅ Controlla la console per errori di path
- ✅ Assicurati che tutti i file siano nella struttura corretta

### File non trovati
- ✅ Verifica la struttura delle cartelle
- ✅ Controlla i path negli import
- ✅ Assicurati che i nomi file corrispondano

### Pagina bianca
- ✅ Controlla la console browser per errori JavaScript
- ✅ Verifica che JSZip sia caricato
- ✅ Usa un server HTTP

## 📊 Statistiche e Report

### Report Utilizzo
- File processati per sessione
- Workflow più utilizzati
- Tempo medio di elaborazione
- Memoria utilizzata
- Raccomandazioni per ottimizzazione

### Export Report
```javascript
// Esporta report utilizzo
app.exportUsageReport()

// Esporta configurazione progetto
app.exportProjectConfig()

// Statistiche applicazione
const stats = app.getApplicationStats()
```

## 🎨 Personalizzazione UI

### Temi CSS
Modifica `css/themes.css` per personalizzare:
- Colori principali
- Gradients
- Effetti glass morphism
- Animazioni

### CSS Variables
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --success-color: #4CAF50;
    --glass-bg: rgba(255, 255, 255, 0.1);
    --radius-lg: 16px;
}
```

## 🚦 Scorciatoie da Tastiera

- `Ctrl+E`: Estrai codice
- `Ctrl+G`: Genera progetto
- `Ctrl+D`: Scarica risultato
- `Tab`: Naviga tra le sezioni

## 📱 Responsive Design

Il sistema è completamente responsive e funziona su:
- 🖥️ Desktop (1200px+)
- 💻 Laptop (768px-1200px)  
- 📱 Tablet (480px-768px)
- 📱 Mobile (320px-480px)

## 🔐 Sicurezza

### Validazioni File
- ✅ Controllo dimensione massima (10MB)
- ✅ Validazione estensioni supportate
- ✅ Sanitizzazione nomi file
- ✅ Controllo path relativi (no `../`)

### Content Security
- ✅ Escape HTML per preview
- ✅ Validazione JSON configurazioni
- ✅ Controllo percorsi sicuri

## 🧪 Testing

### Test Manuali
1. **Code Extraction Test**
   ```
   1. test.kt
   class Test {
       fun main() = println("Hello")
   }
   
   2. test.xml
   <?xml version="1.0"?>
   <root></root>
   ```

2. **Organization Test**
   - Carica file di test
   - Applica configurazione template
   - Verifica risultati

3. **Android Project Test**
   - Usa file Kotlin di esempio
   - Genera progetto Android
   - Verifica struttura ZIP

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📈 Performance

### Ottimizzazioni
- 🚀 **Lazy loading** moduli
- 🚀 **Worker threads** per elaborazioni pesanti
- 🚀 **Caching** risultati intermedi
- 🚀 **Debouncing** input utente
- 🚀 **Memory management** automatico

### Limiti Consigliati
- **File singolo**: max 5MB
- **File totali**: max 50 file
- **Progetto ZIP**: max 50MB
- **Sessione**: max 100 operazioni

## 🔄 Aggiornamenti e Versioning

### Versione Attuale: 2.0.0
- ✅ Architettura modulare completa
- ✅ Code extractor migliorato
- ✅ File organizer avanzato
- ✅ Android builder integrato
- ✅ Web builder aggiunto
- ✅ UI responsive moderna

### Roadmap v2.1
- [ ] Plugin system
- [ ] Cloud storage integration
- [ ] Multi-language support
- [ ] Advanced templates marketplace
- [ ] Collaboration features

### Roadmap v3.0
- [ ] AI-powered code analysis
- [ ] Real-time collaboration
- [ ] Version control integration
- [ ] Advanced project scaffolding
- [ ] Mobile app companion

## 🤝 Contribuire

### Aggiungere Funzionalità
1. Fork del progetto
2. Crea feature branch
3. Implementa modulo in `js/modules/`
4. Aggiungi tests
5. Aggiorna documentazione
6. Submit pull request

### Struttura Commit
```
feat: add new Android template
fix: resolve CORS issue in development
docs: update API documentation
style: improve responsive design
refactor: modularize file processing
test: add unit tests for CodeExtractor
```

## 📞 Support

### Problemi Comuni
1. **"Moduli non caricano"**
   - Usa server HTTP (non file://)
   - Verifica console browser
   - Controlla path files

2. **"File non estratti correttamente"**
   - Usa formato intestazioni numerate
   - Verifica sintassi del codice
   - Controlla caratteri speciali

3. **"Configurazione non valida"**
   - Valida JSON syntax
   - Controlla sezioni supportate
   - Usa template predefiniti

### Debug Steps
1. Apri Developer Tools (F12)
2. Controlla Console per errori
3. Verifica Network tab per file mancanti
4. Testa con template predefiniti
5. Verifica struttura cartelle

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Sentiti libero di utilizzarlo, modificarlo e distribuirlo secondo i termini della licenza.

## 🙏 Crediti

- **JSZip**: Per la creazione di archivi ZIP
- **Modern CSS**: Glass morphism e animazioni moderne
- **ES6 Modules**: Architettura modulare nativa
- **Responsive Design**: Design mobile-first

## 📞 Contatti

Per domande, bug report o richieste di funzionalità:
- 📧 Email: [tuo-email]
- 🐛 Issues: GitHub Issues
- 💬 Discussioni: GitHub Discussions

---

## 🎯 Esempi d'Uso Pratici

### Scenario 1: Sviluppatore Android
```
1. Incolla codice Kotlin da Claude
2. Estrai file automaticamente
3. Usa template Android per organizzazione
4. Genera progetto Android Studio
5. Scarica ZIP pronto per import
```

### Scenario 2: Developer Web
```
1. Incolla codice HTML/CSS/JS
2. Applica organizzazione React
3. Genera progetto con package.json
4. Configura webpack automaticamente
5. Deploy-ready project
```

### Scenario 3: Organizzazione File
```
1. Carica file disorganizzati
2. Definisci regole JSON
3. Anteprima trasformazioni
4. Applica organizzazione
5. Export struttura pulita
```

### Scenario 4: Batch Processing
```
1. Carica multiple set di file
2. Applica template predefiniti
3. Genera progetti multipli
4. Download batch ZIP files
5. Consistent project structure
```

## 🏆 Best Practices

### Per Code Extraction
- ✅ Usa intestazioni numeriche chiare (`1. FileName.ext`)
- ✅ Mantieni sintassi corretta del codice
- ✅ Evita caratteri speciali nei nomi file
- ✅ Raggruppa file correlati insieme

### Per File Organization
- ✅ Testa configurazioni con dry-run
- ✅ Usa path relativi, mai assoluti
- ✅ Valida JSON prima dell'applicazione
- ✅ Backup file importanti prima di modifiche

### Per Project Generation
- ✅ Configura package names corretti
- ✅ Verifica versioni tool compatibili
- ✅ Testa progetti generati prima del deploy
- ✅ Mantieni configurazioni riutilizzabili

### Per Performance
- ✅ Processa file in batch piccoli
- ✅ Chiudi tab inutilizzati durante elaborazione
- ✅ Usa server HTTP locale in sviluppo
- ✅ Monitora utilizzo memoria con DevTools

---

**🎉 Universal Project Builder v2.0 - Il sistema definitivo per gestione progetti da codice!**

*Creato con ❤️ per semplificare il workflow di sviluppo e organizzazione codice.*