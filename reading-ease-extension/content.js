(function () {
    // 1. Inject Global Styles
    const style = document.createElement('style');
    style.textContent = `
        .re-sentence {
            transition: all 0.3s ease;
            cursor: pointer;
            line-height: 1.8;
            font-size: 1.25em; /* Increase font size relative to container */
        }
        
        .re-word {
            display: inline-block;
            margin-right: 0.25em; /* Increase space between words */
        }

        /* Focus Mode Styles */
        body.re-focus-mode .re-sentence {
            filter: blur(2px);
            opacity: 0.6;
            transition: filter 0.5s ease, opacity 0.5s ease;
        }

        body.re-focus-mode .re-sentence:hover {
            filter: blur(1px);
            opacity: 0.8;
        }

        body.re-focus-mode .re-sentence.re-active {
            filter: none;
            opacity: 1;
            background-color: #FFFACD; /* LemonChiffon Highlight */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            color: black;
            border-radius: 4px;
            padding: 4px 8px;
            transform: scale(1.02);
            z-index: 1000;
            position: relative;
            border-left: 5px solid #FFD700;
        }

        /* Mic Button Styles */
        #re-mic-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #3182CE;
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        #re-mic-btn:hover {
            transform: scale(1.1);
        }

        #re-mic-btn.re-listening {
            background: #E53E3E; /* Red when listening */
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(229, 62, 62, 0); }
            100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
        }

        /* Tooltip for functionality */
        .re-tooltip {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }
        #re-mic-btn:hover .re-tooltip {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Activates Focus Mode on first run
    document.body.classList.add('re-focus-mode');

    let activeSentence = null;
    let recognition = null;
    let isListening = false;
    let allSentences = []; // simplified array for navigation

    // --- Voice Logic ---
    function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Web Speech API not supported.");
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            if (!activeSentence) return;

            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalText = event.results[i][0].transcript;
                    console.log("Final Speech:", finalText);
                    checkMatch(finalText);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (interimTranscript) {
                console.log("Listening:", interimTranscript);
                checkMatch(interimTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            if (event.error === 'not-allowed') {
                alert("Please allow microphone access to use Voice Navigation.");
                toggleMic(false);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                console.log("Speech recognition ended (restarting)...");
                // Restart if it stopped unexpectedly but we still want it on
                try { recognition.start(); } catch (e) { }
            }
        };
    }

    function checkMatch(transcript) {
        if (!activeSentence) return;

        // Clean text for comparison (remove punctuation, lowercase)
        const targetText = activeSentence.innerText.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
        const spokenText = transcript.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();

        // Get keywords (last 3-4 words of the sentence)
        const targetWords = targetText.split(' ');
        if (targetWords.length === 0) return;

        // Relaxed Strategy: Check if *any* of the last few words were spoken
        // This helps if the sentence is long and the user pauses, or if speech rec misses a word
        const wordsToCheck = 3;
        const keywords = targetWords.slice(-wordsToCheck);

        console.log(`Checking match...
        Target Sentence (End): "...${keywords.join(' ')}"
        Spoken: "${spokenText}"`);

        // Check if ANY of the keywords are present in the spoken text
        const matchFound = keywords.some(keyword => {
            if (keyword.length < 3) return false; // Ignore short words like 'is', 'a' to avoid false positives
            return spokenText.includes(keyword);
        });

        if (matchFound) {
            console.log("✅ Match found! Advancing...");
            advanceSentence();
        }
    }

    function advanceSentence() {
        if (!activeSentence) return;

        const currentIndex = allSentences.indexOf(activeSentence);
        if (currentIndex < allSentences.length - 1) {
            setActive(allSentences[currentIndex + 1]);
        }
    }

    function toggleMic(forceState) {
        if (!recognition) initSpeechRecognition();
        if (!recognition) return;

        const btn = document.getElementById('re-mic-btn');
        const newState = forceState !== undefined ? forceState : !isListening;

        if (newState) {
            try {
                recognition.start();
                isListening = true;
                btn.classList.add('re-listening');
                btn.querySelector('span').textContent = "Listening...";
                console.log("Microphone started.");
            } catch (e) { console.log(e); }
        } else {
            recognition.stop();
            isListening = false;
            btn.classList.remove('re-listening');
            btn.querySelector('span').textContent = "Mic Off";
            console.log("Microphone stopped.");
        }
    }

    // --- UI Setup ---
    function createMicButton() {
        if (document.getElementById('re-mic-btn')) return; // Avoid duplicates

        const btn = document.createElement('button');
        btn.id = 're-mic-btn';
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            <div class="re-tooltip"><span>Mic Off</span></div>
        `;
        btn.addEventListener('click', () => toggleMic());
        document.body.appendChild(btn);
    }


    // --- Core Focus Mode Logic ---
    function setActive(sentenceElement) {
        if (activeSentence) {
            activeSentence.classList.remove('re-active');
        }
        activeSentence = sentenceElement;
        activeSentence.classList.add('re-active');

        // Scroll into view if needed
        activeSentence.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function bionicifyWord(word) {
        if (!word) return '';
        const match = word.match(/^([a-zA-Z]+)(.*)$/);
        if (!match) return `<span class="re-word">${word}</span>`;

        const [_, letters, punctuation] = match;
        const len = letters.length;
        let mid;
        if (len <= 3) mid = 1;
        else mid = Math.ceil(len / 2);

        const bold = letters.slice(0, mid);
        const regular = letters.slice(mid);

        return `<span class="re-word"><b>${bold}</b>${regular}${punctuation}</span>`;
    }

    // TreeWalker to find text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // Ignore script, style, hidden elements, and interactive elements to avoid breaking UI
                const tag = node.parentElement.tagName;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(tag) ||
                    !node.nodeValue.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodesToReplace = [];
    while (walker.nextNode()) {
        nodesToReplace.push(walker.currentNode);
    }

    nodesToReplace.forEach(node => {
        const text = node.nodeValue;
        // Split into sentences (simple punctuation based)
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);

        if (!sentences) return;

        const fragment = document.createDocumentFragment();

        sentences.forEach(sentenceText => {
            if (!sentenceText.trim()) return;

            const span = document.createElement('span');
            span.className = 're-sentence';
            span.tabIndex = 0; // Make focusable

            // Bionic Processing
            const words = sentenceText.split(/\s+/);
            span.innerHTML = words.map(bionicifyWord).join(' ') + ' '; // Add space back

            // Interaction
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                updateActiveFromClick(span);
            });

            fragment.appendChild(span);
            allSentences.push(span); // Track for navigation
        });

        // Replace text node with our interactive spans
        if (fragment.children.length > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    });

    function updateActiveFromClick(span) {
        setActive(span);
    }

    // Set first sentence as active initially
    if (allSentences.length > 0) {
        console.log("Extension loaded. Highlighting first sentence.");
        setActive(allSentences[0]);
    } else {
        console.warn("No sentences found.");
    }

    createMicButton();

})();
