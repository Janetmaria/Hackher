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
        }

        body.re-focus-mode .re-sentence:hover {
            filter: blur(1px);
            opacity: 0.8;
        }

        body.re-focus-mode .re-sentence.re-active {
            filter: none;
            opacity: 1;
            background-color: #FFFACD; /* LemonChiffon Highlight */
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: black;
            border-radius: 4px;
            padding: 2px 4px;
            transform: scale(1.02);
            z-index: 1000;
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // Activates Focus Mode on first run
    document.body.classList.add('re-focus-mode');

    let activeSentence = null;

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
                setActive(span);
            });

            fragment.appendChild(span);
        });

        // Replace text node with our interactive spans
        if (fragment.children.length > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    });

    // Set first sentence as active initially
    const firstSentence = document.querySelector('.re-sentence');
    if (firstSentence) setActive(firstSentence);

})();
