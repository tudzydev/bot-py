/* ==========================================================================
   PyAcademy AI - Application Logic, Curriculum & Interpreter Integration
   ========================================================================== */

// Pyodide instance variable
let pyodideInstance = null;

// Application State
const state = {
  currentModuleIndex: 0,
  activeTab: 'lesson',
  apiKey: localStorage.getItem('pyacademy_gemini_key') || '',
  progress: JSON.parse(localStorage.getItem('pyacademy_progress')) || {},
  chatHistory: [],
  editorCodes: {} // Store custom code overrides per module
};

// Curriculum Database (9 modules aligned with W3Schools)
const syllabus = [
  {
    id: 'syntax',
    category: 'Basics',
    title: 'Python Intro & Syntax',
    desc: 'Indentation, writing comments, and basic execution flow.',
    lessonHtml: `
      <h2>Python Syntax</h2>
      <p>Python syntax can be executed by writing code directly in the editor and pressing "Run". Unlike many other programming languages, Python uses <strong>indentation</strong> to define code blocks (functions, loops, conditions) instead of curly braces or semicolons.</p>
      
      <div class="note-box">
        <h4><i class="fas fa-exclamation-triangle"></i> Indentation is Critical</h4>
        <p>Python uses indentation to indicate a block of code. The number of spaces is up to you, but it must be consistent. Typically, 4 spaces are used.</p>
      </div>

      <h3>Example</h3>
      <p>Look at this valid Python structure where print statements are indented under the conditional block:</p>
    `,
    snippetCode: `if 5 > 2:
    print("Five is greater than two!")
    if 10 > 5:
        print("Ten is also greater than five!")`,
    quiz: {
      type: 'multiple-choice',
      question: 'Which of the following is the correct syntax to output "Hello World" in Python?',
      options: [
        'echo("Hello World")',
        'print("Hello World")',
        'Console.WriteLine("Hello World")',
        'print Hello World'
      ],
      correctIndex: 1,
      explanation: 'In Python, we use the print() function to write output. Strings must be enclosed in quotes.'
    }
  },
  {
    id: 'variables',
    category: 'Basics',
    title: 'Variables & Data Types',
    desc: 'Storing strings, numbers, floats, and booleans.',
    lessonHtml: `
      <h2>Python Variables & Data Types</h2>
      <p>Variables are containers for storing data values. In Python, variables are created the moment you first assign a value to them, without needing to declare their data type.</p>
      
      <h3>Key Built-in Data Types</h3>
      <ul>
        <li><code>str</code>: Textual data, defined with double or single quotes (e.g., <code>"Alice"</code>)</li>
        <li><code>int</code>: Whole numbers, positive or negative (e.g., <code>100</code>)</li>
        <li><code>float</code>: Decimal numbers (e.g., <code>9.95</code>)</li>
        <li><code>bool</code>: Boolean truth values (<code>True</code> or <code>False</code>)</li>
      </ul>

      <div class="note-box">
        <h4><i class="fas fa-info-circle"></i> Dynamic Typing</h4>
        <p>You can even change the type of a variable after it has been set! This is called dynamic typing.</p>
      </div>
    `,
    snippetCode: `# Variable assignments
x = 5
name = "PyAcademy"
grade = 98.6
is_cool = True

print(x)
print(name)
print("Type of grade:", type(grade))
print("Is cool?", is_cool)`,
    quiz: {
      type: 'fill-in-the-blank',
      question: 'Complete the block below to assign the value 15 to a variable named index, then print it.',
      codeTemplate: `<span class="quiz-code-line"><input type="text" id="blank-1" class="quiz-input-blank" placeholder="variable"> = 15</span>
<span class="quiz-code-line"><input type="text" id="blank-2" class="quiz-input-blank" placeholder="function">(index)</span>`,
      correctAnswers: ['index', 'print'],
      explanation: 'To assign a value, write the variable name first, then "=", followed by the value. Use print() to display variables.'
    }
  },
  {
    id: 'operators',
    category: 'Basics',
    title: 'Python Operators',
    desc: 'Arithmetic, modulo division, and logical operators.',
    lessonHtml: `
      <h2>Python Operators</h2>
      <p>Operators are used to perform operations on variables and values. Python divides operators into arithmetic, assignment, comparison, logical, identity, and membership operators.</p>
      
      <h3>Arithmetic Operators</h3>
      <ul>
        <li><code>+</code> Addition, <code>-</code> Subtraction</li>
        <li><code>*</code> Multiplication, <code>/</code> Division</li>
        <li><code>%</code> Modulus (returns the remainder of division)</li>
        <li><code>**</code> Exponentiation (power)</li>
        <li><code>//</code> Floor division (rounds down to nearest integer)</li>
      </ul>
    `,
    snippetCode: `# Modulus remainder operator
remainder = 10 % 3
print("10 % 3 =", remainder)

# Exponent power
power = 2 ** 5
print("2 ** 5 =", power)

# Floor division
floor = 10 // 3
print("10 // 3 =", floor)`,
    quiz: {
      type: 'multiple-choice',
      question: 'What is the output of the following statement: print(11 % 4)?',
      options: [
        '2.75',
        '2',
        '3',
        '8'
      ],
      correctIndex: 2,
      explanation: 'The % (modulus) operator returns the division remainder. 11 divided by 4 is 2 with a remainder of 3.'
    }
  },
  {
    id: 'collections',
    category: 'Data Structures',
    title: 'Lists & Dictionaries',
    desc: 'Managing ordered lists and key-value maps.',
    lessonHtml: `
      <h2>Lists and Dictionaries</h2>
      <p>Python has four built-in collection types. Today we focus on the two most common:</p>
      
      <h3>1. Lists</h3>
      <p>Lists are ordered, changeable collection of items. Written with square brackets <code>[]</code>. Lists are 0-indexed.</p>
      
      <h3>2. Dictionaries</h3>
      <p>Dictionaries store data key-value pairs. They are ordered (since 3.7), changeable, and do not allow duplicate keys. Written with curly brackets <code>{}</code>.</p>
    `,
    snippetCode: `# Lists
fruits = ["apple", "banana", "cherry"]
print("Second fruit:", fruits[1]) # banana
fruits.append("orange")

# Dictionaries
user = {
  "username": "coder99",
  "points": 450,
  "premium": True
}
print(user["username"])
print("Points:", user.get("points"))`,
    quiz: {
      type: 'multiple-choice',
      question: 'Which method is used to add an item to the end of a Python List?',
      options: [
        'add()',
        'push()',
        'append()',
        'insert()'
      ],
      correctIndex: 2,
      explanation: 'Use the append() list method to add elements to the end of lists. push() is used in Javascript/other languages.'
    }
  },
  {
    id: 'conditionals',
    category: 'Control Flow',
    title: 'If...Else Conditionals',
    desc: 'Decision-making with if, elif, and else statements.',
    lessonHtml: `
      <h2>If...Else Conditionals</h2>
      <p>Python supports the logical conditions from mathematics. These can be used in <code>if</code> statements.</p>
      
      <h3>Keywords</h3>
      <ul>
        <li><code>if</code>: Core conditional statement.</li>
        <li><code>elif</code>: Short for "else if" - checks if prior conditions were not met.</li>
        <li><code>else</code>: Catches anything which wasn't caught by preceding conditions.</li>
      </ul>
      
      <div class="note-box">
        <h4><i class="fas fa-code"></i> Comparisons</h4>
        <p>Be sure to use double equals <code>==</code> for comparison. Single equals <code>=</code> is for assignment!</p>
      </div>
    `,
    snippetCode: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Grade: C or below")`,
    quiz: {
      type: 'fill-in-the-blank',
      question: 'Fill in the blanks to print "Success" if status is "active".',
      codeTemplate: `<span class="quiz-code-line">status = "active"</span>
<span class="quiz-code-line"><input type="text" id="blank-1" class="quiz-input-blank" placeholder="if keyword"> status <input type="text" id="blank-2" class="quiz-input-blank" placeholder="operator"> "active"<input type="text" id="blank-3" class="quiz-input-blank" placeholder="colon">:</span>
<span class="quiz-code-line">    print("Success")</span>`,
      correctAnswers: ['if', '==', ':'],
      explanation: 'A conditional statement begins with "if", checks equality with "==", and ends the condition line with a colon ":".'
    }
  },
  {
    id: 'loops',
    category: 'Control Flow',
    title: 'Loops (While & For)',
    desc: 'Iterating over lists and repeating code using loops.',
    lessonHtml: `
      <h2>Python Loops</h2>
      <p>Python has two primitive loop commands: <code>while</code> loops and <code>for</code> loops.</p>
      
      <h3>While Loops</h3>
      <p>Executes a set of statements as long as a condition is true. Be careful to increment your loop variable to avoid infinite loops!</p>
      
      <h3>For Loops</h3>
      <p>Used for iterating over a sequence (such as a list, a tuple, a dictionary, or a string) or using the <code>range()</code> function.</p>
    `,
    snippetCode: `# While Loop
count = 1
while count <= 3:
    print("Count:", count)
    count += 1

print("---")

# For Loop with range
for i in range(3):
    print("Loop index:", i)`,
    quiz: {
      type: 'multiple-choice',
      question: 'What sequence is generated by the expression range(1, 5)?',
      options: [
        '[1, 2, 3, 4, 5]',
        '[1, 2, 3, 4]',
        '[0, 1, 2, 3, 4]',
        '[2, 3, 4, 5]'
      ],
      correctIndex: 1,
      explanation: 'The range(start, stop) function generates numbers starting from the start index up to, but not including, the stop index.'
    }
  },
  {
    id: 'functions',
    category: 'Functions',
    title: 'Functions & Return Values',
    desc: 'Creating reusable blocks of code using def and returns.',
    lessonHtml: `
      <h2>Python Functions</h2>
      <p>A function is a block of code which only runs when it is called. You can pass parameters into a function, and return values back.</p>
      
      <h3>Defining and Calling</h3>
      <p>In Python, a function is defined using the <code>def</code> keyword, followed by parenthesis and a colon.</p>
    `,
    snippetCode: `# Define a function
def calculate_area(width, height):
    area = width * height
    return area

# Call the function
result = calculate_area(5, 8)
print("Area of rectangle:", result)`,
    quiz: {
      type: 'multiple-choice',
      question: 'Which keyword is used to create a function in Python?',
      options: [
        'function',
        'define',
        'func',
        'def'
      ],
      correctIndex: 3,
      explanation: 'Python uses the def (define) keyword to declare functions.'
    }
  },
  {
    id: 'oop',
    category: 'Object Oriented',
    title: 'Classes & Objects (OOP)',
    desc: 'Defining classes, properties, constructors, and methods.',
    lessonHtml: `
      <h2>Classes and Objects (OOP)</h2>
      <p>Python is an object-oriented programming language. Almost everything in Python is an object, with its properties and methods.</p>
      
      <h3>The __init__() Constructor</h3>
      <p>All classes have a built-in function called <code>__init__()</code>, which is executed when the class object is being constructed. It is used to assign values to object properties.</p>
      
      <h3>The self Parameter</h3>
      <p>The <code>self</code> parameter is a reference to the current instance of the class, and is used to access variables that belong to the class.</p>
    `,
    snippetCode: `class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

    def drive(self):
        print(self.brand + " " + self.model + " is driving!")

# Instantiate class object
my_car = Car("Tesla", "Model S")
my_car.drive()`,
    quiz: {
      type: 'fill-in-the-blank',
      question: 'Complete the Python class definition below.',
      codeTemplate: `<span class="quiz-code-line"><input type="text" id="blank-1" class="quiz-input-blank" placeholder="class keyword"> Student:</span>
<span class="quiz-code-line">    def <input type="text" id="blank-2" class="quiz-input-blank" placeholder="constructor">(self, name):</span>
<span class="quiz-code-line">        self.name = name</span>`,
      correctAnswers: ['class', '__init__'],
      explanation: 'Use the class keyword to create a class, and def __init__(self, ...) to define the object constructor.'
    }
  },
  {
    id: 'filehandling',
    category: 'Advanced',
    title: 'Python File Handling',
    desc: 'Reading and writing files on the local filesystem.',
    lessonHtml: `
      <h2>Python File Handling</h2>
      <p>File handling is an important part of any application. Python has several functions for creating, reading, updating, and deleting files.</p>
      
      <h3>The open() Function</h3>
      <p>The key function for working with files in Python is the <code>open()</code> function. It takes two parameters: filename and mode.</p>
      
      <h3>Modes</h3>
      <ul>
        <li><code>"r"</code>: Read - Default value. Opens a file for reading, error if file does not exist.</li>
        <li><code>"w"</code>: Write - Opens a file for writing, creates the file if it does not exist, overwrites existing contents.</li>
        <li><code>"a"</code>: Append - Opens a file for appending text, creates the file if it does not exist.</li>
      </ul>
    `,
    snippetCode: `# Open/Create a virtual file and write data
f = open("my_test.txt", "w")
f.write("Learning python file handling on PyAcademy.")
f.close()

# Read the file
f = open("my_test.txt", "r")
content = f.read()
print("File Content:", content)
f.close()`,
    quiz: {
      type: 'multiple-choice',
      question: 'Which open mode creates a file if it does not exist and overwrites existing contents?',
      options: [
        'r',
        'w',
        'a',
        'x'
      ],
      correctIndex: 1,
      explanation: 'The "w" mode opens a file for writing, overwriting any existing contents. "a" appends, and "r" reads.'
    }
  }
];

// Initialize Application on Page Load
window.addEventListener('DOMContentLoaded', () => {
  renderModulesSyllabus();
  loadCurrentTopic();
  initPyodide();
  updateProgressBadge();
  setupApiKeyField();
});

// Setup settings fields from LocalStorage
function setupApiKeyField() {
  const input = document.getElementById('gemini-api-key');
  if (state.apiKey) {
    input.value = state.apiKey;
    updateApiBadge(true);
  } else {
    updateApiBadge(false);
  }
}

// Update Header API Badge style
function updateApiBadge(hasKey) {
  const badge = document.getElementById('api-status-badge');
  if (hasKey) {
    badge.innerHTML = '<i class="fas fa-robot"></i> <span>Gemini AI Mode</span>';
    badge.classList.add('active');
  } else {
    badge.innerHTML = '<i class="fas fa-key"></i> <span>Local Mode</span>';
    badge.classList.remove('active');
  }
}

// --------------------------------------------------------------------------
// Pyodide (WASM Python Engine) Initialization
// --------------------------------------------------------------------------
async function initPyodide() {
  const loaderText = document.getElementById('loader-text');
  const loaderProgress = document.getElementById('loader-progress');
  const overlay = document.getElementById('loader-overlay');
  
  try {
    loaderText.innerText = "Connecting to Pyodide WebAssembly system...";
    
    // Load pyodide core from jsdelivr loaded script
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
    });
    
    loaderText.innerText = "Pre-loading standard IO buffers...";
    
    // Initialize standard IO capture in Pyodide
    await pyodideInstance.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);
    
    // Smooth transition away loader overlay
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
    
    appendBotMessage("PyAcademy local Python interpreter initialized! You can write and execute code in the **Editor** tab.");
  } catch (error) {
    console.error("Pyodide Load Error: ", error);
    loaderText.innerHTML = `<span style="color:var(--color-error)">Execution Engine Error</span><br>Could not load Python runtime. Please check internet connection.`;
    loaderProgress.style.background = "var(--color-error)";
    loaderProgress.style.animation = "none";
    loaderProgress.style.width = "100%";
  }
}

// --------------------------------------------------------------------------
// Curriculum Navigation & UI rendering
// --------------------------------------------------------------------------
function renderModulesSyllabus() {
  const nav = document.getElementById('modules-nav');
  nav.innerHTML = '';
  
  syllabus.forEach((mod, idx) => {
    const isCompleted = state.progress[mod.id] ? 'completed' : '';
    const isActive = idx === state.currentModuleIndex ? 'active' : '';
    
    let statusIcon = '<i class="far fa-circle"></i>';
    if (isCompleted) {
      statusIcon = '<i class="fas fa-check-circle"></i>';
    } else if (isActive) {
      statusIcon = '<i class="fas fa-play"></i>';
    }
    
    const div = document.createElement('button');
    div.className = `module-nav-item ${isActive} ${isCompleted}`;
    div.onclick = () => selectModule(idx);
    div.innerHTML = `
      <div class="module-nav-content">
        <span class="module-nav-title">${mod.title}</span>
        <span class="module-nav-desc">${mod.desc}</span>
      </div>
      <span class="module-status">${statusIcon}</span>
    `;
    nav.appendChild(div);
  });
}

function selectModule(idx) {
  state.currentModuleIndex = idx;
  renderModulesSyllabus();
  loadCurrentTopic();
  
  // Switch back to lesson view by default when changing topics
  switchTab('lesson');
  
  // Mentor notification
  const activeTopic = syllabus[idx];
  updateTutorStatus("Online", false);
  appendBotMessage(`Switched to **${activeTopic.title}**. If you need explanations or have custom coding tasks, ask me in chat!`);
}

function loadCurrentTopic() {
  const activeTopic = syllabus[state.currentModuleIndex];
  
  // Render main lesson header meta
  document.getElementById('current-category').innerText = activeTopic.category;
  document.getElementById('current-topic-title').innerText = activeTopic.title;
  
  // Build lesson HTML content with embedded examples
  let content = activeTopic.lessonHtml;
  
  // Format code example as a snippet box
  content += `
    <div class="snippet-box">
      <div class="snippet-header">
        <span><i class="fab fa-python"></i> Python Syntax Code Example</span>
        <button class="run-snippet-btn" onclick="goToEditorWithSnippet()">Try it Yourself &rarr;</button>
      </div>
      <pre><code class="language-python">${escapeHTML(activeTopic.snippetCode)}</code></pre>
    </div>
  `;
  
  document.getElementById('lesson-content').innerHTML = content;
  Prism.highlightAll(); // Trigger syntax highlight parsing on dynamically added code blocks
  
  // Load editor code snippet (use user modifications if any exist, otherwise defaults)
  const currentCode = state.editorCodes[activeTopic.id] || activeTopic.snippetCode;
  document.getElementById('code-editor').value = currentCode;
  updateEditorHighlighting();
  
  // Load Quiz contents
  loadQuiz();
}

// Escape html helper to print code blocks safely
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --------------------------------------------------------------------------
// Custom Code Playground Panel Logic
// --------------------------------------------------------------------------
function updateEditorHighlighting() {
  const codeEditor = document.getElementById('code-editor');
  const highlightCode = document.getElementById('editor-highlight-code');
  
  // Fetch value
  let text = codeEditor.value;
  
  // Save user code state dynamically
  const activeTopic = syllabus[state.currentModuleIndex];
  state.editorCodes[activeTopic.id] = text;
  
  // Sync syntax highlight box
  highlightCode.textContent = text;
  Prism.highlightElement(highlightCode);
  
  // Recalculate line numbers
  updateLineNumbers();
}

function updateLineNumbers() {
  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  const lines = codeEditor.value.split('\n').length;
  
  let lineNumHtml = '';
  for (let i = 1; i <= lines; i++) {
    lineNumHtml += i + '<br>';
  }
  lineNumbers.innerHTML = lineNumHtml;
}

// Syncing scroll states between transparent textarea and high-quality syntax display
document.getElementById('code-editor').addEventListener('scroll', () => {
  const codeEditor = document.getElementById('code-editor');
  const highlightPre = document.getElementById('editor-highlight-pre');
  const lineNumbers = document.getElementById('line-numbers');
  
  highlightPre.scrollTop = codeEditor.scrollTop;
  highlightPre.scrollLeft = codeEditor.scrollLeft;
  lineNumbers.scrollTop = codeEditor.scrollTop;
});

// Keyboard Tab key capturing inside textarea
function handleTabPress(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Insert 4 spaces at cursor
    textarea.value = textarea.value.substring(0, start) + "    " + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 4;
    
    updateEditorHighlighting();
  }
}

// Reset code panel to initial syllabus template
function resetEditorCode() {
  const activeTopic = syllabus[state.currentModuleIndex];
  state.editorCodes[activeTopic.id] = activeTopic.snippetCode;
  document.getElementById('code-editor').value = activeTopic.snippetCode;
  updateEditorHighlighting();
}

// Load snippet into playground and swap tabs automatically
function goToEditorWithSnippet() {
  switchTab('editor');
  
  // Focus and select editor
  setTimeout(() => {
    document.getElementById('code-editor').focus();
  }, 100);
}

// Swap content panel panes (Lesson, Editor, Quiz)
function switchTab(tabName) {
  state.activeTab = tabName;
  
  // Update header button classes
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
  
  // Update visibility of content sections
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(`pane-${tabName}`).classList.add('active');
  
  // Special overrides
  if (tabName === 'editor') {
    updateLineNumbers();
    // Scroll align
    const codeEditor = document.getElementById('code-editor');
    const highlightPre = document.getElementById('editor-highlight-pre');
    highlightPre.scrollTop = codeEditor.scrollTop;
    highlightPre.scrollLeft = codeEditor.scrollLeft;
  }
}

// Execute python scripts using local WebAssembly pyodide environment
async function executePythonCode() {
  const code = document.getElementById('code-editor').value;
  const terminal = document.getElementById('terminal-output');
  const runBtn = document.getElementById('run-code-btn');
  
  if (!pyodideInstance) {
    terminal.innerHTML = `<span class="stderr">Engine Error: Runtime is still initializing...</span>`;
    return;
  }
  
  runBtn.disabled = true;
  runBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Running`;
  terminal.innerHTML = `<span class="system-msg">Compiling and running Python code script...</span>\n`;
  
  try {
    // Clear out Pyodide IO buffers first
    await pyodideInstance.runPythonAsync(`
sys.stdout.truncate(0)
sys.stdout.seek(0)
sys.stderr.truncate(0)
sys.stderr.seek(0)
    `);
    
    // Execute python script
    await pyodideInstance.runPythonAsync(code);
    
    // Fetch buffered stdout
    const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
    const stderr = pyodideInstance.runPython("sys.stderr.getvalue()");
    
    let consoleText = '';
    if (stdout) {
      consoleText += escapeHTML(stdout);
    }
    if (stderr) {
      consoleText += `<span class="stderr">${escapeHTML(stderr)}</span>`;
    }
    
    if (!stdout && !stderr) {
      consoleText += `<span class="system-msg">[Script completed execution with no terminal outputs]</span>`;
    }
    
    terminal.innerHTML = consoleText;
  } catch (error) {
    // Retrieve virtual stderr
    const pyStderr = pyodideInstance.runPython("sys.stderr.getvalue()");
    terminal.innerHTML = `<span class="stderr">${escapeHTML(pyStderr || error.message)}</span>`;
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = `<i class="fas fa-play"></i> Run Code`;
  }
}

// --------------------------------------------------------------------------
// Interactive Quizzes Panel Logic
// --------------------------------------------------------------------------
let selectedOptionIndex = null;

function loadQuiz() {
  const activeTopic = syllabus[state.currentModuleIndex];
  const container = document.getElementById('quiz-content');
  const quiz = activeTopic.quiz;
  
  selectedOptionIndex = null;
  
  let html = `
    <div class="quiz-card">
      <div class="quiz-question-number">Practice Quiz: ${activeTopic.title}</div>
      <div class="quiz-question-text">${quiz.question}</div>
  `;
  
  if (quiz.type === 'multiple-choice') {
    html += `<div class="quiz-options">`;
    quiz.options.forEach((opt, idx) => {
      html += `
        <div class="quiz-option" id="opt-${idx}" onclick="selectQuizOption(${idx})">
          <div class="option-marker">${String.fromCharCode(65 + idx)}</div>
          <span>${escapeHTML(opt)}</span>
        </div>
      `;
    });
    html += `</div>`;
  } else if (quiz.type === 'fill-in-the-blank') {
    html += `
      <div class="code-blank-container">
        ${quiz.codeTemplate}
      </div>
    `;
  }
  
  html += `
      <div id="quiz-feedback-box" class="quiz-feedback"></div>
      <div class="quiz-actions">
        <button class="action-btn primary-btn" id="submit-quiz-btn" onclick="submitQuizAnswer()">Submit Answer</button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

function selectQuizOption(idx) {
  const activeTopic = syllabus[state.currentModuleIndex];
  if (state.progress[activeTopic.id]) return; // Disable selection if already completed
  
  selectedOptionIndex = idx;
  document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
  document.getElementById(`opt-${idx}`).classList.add('selected');
}

function submitQuizAnswer() {
  const activeTopic = syllabus[state.currentModuleIndex];
  const quiz = activeTopic.quiz;
  const feedback = document.getElementById('quiz-feedback-box');
  const submitBtn = document.getElementById('submit-quiz-btn');
  
  if (quiz.type === 'multiple-choice') {
    if (selectedOptionIndex === null) {
      feedback.className = 'quiz-feedback error';
      feedback.innerText = 'Please select one option before submitting.';
      return;
    }
    
    const correct = selectedOptionIndex === quiz.correctIndex;
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    
    if (correct) {
      document.getElementById(`opt-${selectedOptionIndex}`).classList.add('correct');
      feedback.className = 'quiz-feedback success';
      feedback.innerHTML = `<strong>Correct!</strong> <br>${quiz.explanation}`;
      
      markModuleCompleted(activeTopic.id);
    } else {
      document.getElementById(`opt-${selectedOptionIndex}`).classList.add('incorrect');
      document.getElementById(`opt-${quiz.correctIndex}`).classList.add('correct');
      feedback.className = 'quiz-feedback error';
      feedback.innerHTML = `<strong>Incorrect.</strong> <br>${quiz.explanation}`;
    }
  } else if (quiz.type === 'fill-in-the-blank') {
    let answersCorrect = true;
    const userAnswers = [];
    
    quiz.correctAnswers.forEach((ans, idx) => {
      const input = document.getElementById(`blank-${idx + 1}`);
      const val = input.value.trim();
      userAnswers.push(val);
      
      if (val !== ans) {
        answersCorrect = false;
        input.style.borderColor = 'var(--color-error)';
      } else {
        input.style.borderColor = 'var(--color-success)';
      }
    });
    
    if (answersCorrect) {
      feedback.className = 'quiz-feedback success';
      feedback.innerHTML = `<strong>All blanks filled correctly! Good Job!</strong> <br>${quiz.explanation}`;
      markModuleCompleted(activeTopic.id);
    } else {
      feedback.className = 'quiz-feedback error';
      feedback.innerHTML = `<strong>Some fields are incorrect.</strong> Please review the answers. Hint: Variable assignments and standard function statements.`;
    }
  }
}

function markModuleCompleted(id) {
  state.progress[id] = true;
  localStorage.setItem('pyacademy_progress', JSON.stringify(state.progress));
  
  // Highlight completed list
  renderModulesSyllabus();
  updateProgressBadge();
  
  // Alert tutor response
  updateTutorStatus("Online", false);
  setTimeout(() => {
    appendBotMessage(`🎉 Fantastic! You completed the quiz for **${syllabus.find(s => s.id === id).title}**. Let's keep moving forward!`);
  }, 1000);
}

function updateProgressBadge() {
  const completedCount = Object.keys(state.progress).length;
  const percentage = Math.round((completedCount / syllabus.length) * 100);
  
  document.getElementById('overall-progress').innerText = `${percentage}% Done`;
  document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
}

// --------------------------------------------------------------------------
// AI Coding Tutor Chat System
// --------------------------------------------------------------------------
function updateTutorStatus(statusText, isThinking) {
  const dot = document.getElementById('tutor-dot');
  const txt = document.getElementById('tutor-status-text');
  txt.innerText = statusText;
  
  if (isThinking) {
    dot.className = 'status-dot thinking';
  } else {
    dot.className = 'status-dot pulsing';
  }
}

function handleChatSubmit(e) {
  if (e.key === 'Enter') {
    submitChatMessage();
  }
}

function submitChatMessage() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  
  appendUserMessage(msg);
  input.value = '';
  
  // Generate response
  processTutorResponse(msg);
}

function appendUserMessage(text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-message user';
  div.innerHTML = `
    <div class="avatar"><i class="fas fa-user"></i></div>
    <div class="message-bubble">${escapeHTML(text)}</div>
  `;
  container.appendChild(div);
  scrollToBottom(container);
  
  // Add to local chat logs
  state.chatHistory.push({ role: 'user', text });
}

function appendBotMessage(text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-message bot';
  
  // Render clean simple markdown-like code block highlights inside the avatar message bubble
  let formattedText = formatMarkdown(text);
  
  div.innerHTML = `
    <div class="avatar"><i class="fas fa-robot"></i></div>
    <div class="message-bubble">${formattedText}</div>
  `;
  container.appendChild(div);
  scrollToBottom(container);
  
  state.chatHistory.push({ role: 'bot', text });
}

// Quick markdown syntax highlighter helper for AI replies
function formatMarkdown(text) {
  // Replace triple backticks with pre/code elements
  let formatted = text.replace(/```python\n([\s\S]*?)\n```/g, (match, code) => {
    return `<pre><code class="language-python">${escapeHTML(code)}</code></pre>`;
  });
  
  formatted = formatted.replace(/```([\s\S]*?)\n```/g, (match, code) => {
    return `<pre><code>${escapeHTML(code)}</code></pre>`;
  });
  
  // Replace inline backticks
  formatted = formatted.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${escapeHTML(code)}</code>`;
  });
  
  // Bold headings
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  return formatted;
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}

function clearChat() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = `
    <div class="chat-message bot">
      <div class="avatar"><i class="fas fa-robot"></i></div>
      <div class="message-bubble">
        Hello! I am your PyAcademy AI Mentor. I can explain code snippets, debug errors in your playground, or ask custom questions. How can I help you today?
      </div>
    </div>
  `;
  state.chatHistory = [];
}

// Quick Suggestion Prompts
function askQuickPrompt(action) {
  const activeTopic = syllabus[state.currentModuleIndex];
  let promptText = "";
  
  switch(action) {
    case 'explain':
      promptText = `Can you explain the main concepts of ${activeTopic.title} lesson with code examples?`;
      break;
    case 'debug':
      promptText = `I ran my code in the sandbox playground. Can you check my variables and logic for syntax mistakes?`;
      break;
    case 'challenge':
      promptText = `Give me a small Python coding challenge task regarding ${activeTopic.title}.`;
      break;
  }
  
  appendUserMessage(promptText);
  processTutorResponse(promptText);
}

// --------------------------------------------------------------------------
// LLM Fetch Engine (Gemini API vs Local Rule Simulator)
// --------------------------------------------------------------------------
async function processTutorResponse(userMsg) {
  updateTutorStatus("Thinking...", true);
  
  // Show standard Typing bubbles
  const container = document.getElementById('chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot';
  typingDiv.id = 'typing-indicator-msg';
  typingDiv.innerHTML = `
    <div class="avatar"><i class="fas fa-robot"></i></div>
    <div class="message-bubble">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  container.appendChild(typingDiv);
  scrollToBottom(container);
  
  // Fetch active topic state for prompt engineering context
  const activeTopic = syllabus[state.currentModuleIndex];
  const currentCode = document.getElementById('code-editor').value;
  const currentTerminalOutput = document.getElementById('terminal-output').innerText;
  
  // Delay a bit for realism
  setTimeout(async () => {
    let responseText = "";
    
    if (state.apiKey) {
      // Connect to Google Gemini API
      try {
        responseText = await callGeminiAPI(userMsg, activeTopic, currentCode, currentTerminalOutput);
      } catch (err) {
        console.error("Gemini API error: ", err);
        responseText = `⚠️ **Gemini API Error:** ${err.message}. Reverting to Local offline tutor response... \n\n` + simulateLocalTutor(userMsg, activeTopic, currentCode, currentTerminalOutput);
      }
    } else {
      // Fallback offline simulator
      responseText = simulateLocalTutor(userMsg, activeTopic, currentCode, currentTerminalOutput);
    }
    
    // Clear typing bubble
    const typing = document.getElementById('typing-indicator-msg');
    if (typing) typing.remove();
    
    appendBotMessage(responseText);
    updateTutorStatus("Ready to help", false);
  }, 1200);
}

// Calling actual Google Gemini endpoints
async function callGeminiAPI(message, topic, code, consoleLogs) {
  // Construct strong system helper prompt
  const systemPrompt = `You are PyAcademy's AI Programming Mentor. You are tutoring a student on Python who is currently studying the module "${topic.title}" (Category: ${topic.category}). 
The student has access to an in-browser Python Code Editor and a Terminal window. 
Here is their current script in their code editor:
\`\`\`python
${code}
\`\`\`
Here is the terminal output from running their code:
"""
${consoleLogs}
"""

Guidelines:
1. Provide constructive, brief explanations.
2. If they ask to debug, look at their code variables, imports, syntax, indentation, and terminal output. Point out errors without immediately writing the whole solution; guide them to learn.
3. Keep replies under 150 words.
4. Format output using markdown backticks for python code snippets.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser Question: ${message}` }
          ]
        }
      ]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Received empty response payload from Gemini");
  return text;
}

// Fallback rule-based simulator
function simulateLocalTutor(msg, topic, code, consoleLogs) {
  const query = msg.toLowerCase();
  
  // Check debug requests
  if (query.includes('debug') || query.includes('error') || query.includes('fail') || query.includes('syntax') || query.includes('wrong')) {
    // Basic analysis on common pitfalls
    if (topic.id === 'syntax') {
      if (!code.includes('    ') && code.includes('if ')) {
        return `🪲 **Indentation Check:** \nIn Python, conditions must indent the execution lines. Your sandbox code defines an \`if\` but the \`print()\` doesn't seem to be indented with spaces. Highlight the lines, press Tab, and run again!`;
      }
    }
    
    if (topic.id === 'variables') {
      // Check undefined variables printed
      if (consoleLogs.includes('NameError')) {
        return `🪲 **Variable Check:** \nIt looks like you encountered a \`NameError\`. Check that you assigned the variable (e.g. \`x = 10\`) *before* referencing it in print functions, and make sure capitalization matches exactly.`;
      }
    }
    
    if (topic.id === 'operators') {
      if (code.includes(' = ') && !code.match(/[+\-*/%]/)) {
        return `🪲 **Operators Check:** \nTo practice operators, try modifying the variables with arithmetic math symbols like modulo division (\`%\`) or exponents (\`**\`) and print the results.`;
      }
    }
    
    if (topic.id === 'oop') {
      if (code.includes('class') && !code.includes('self')) {
        return `🪲 **OOP Reference Check:** \nDid you miss the \`self\` argument inside your class constructor or method? Every instance method in Python must accept \`self\` as its first parameter to read object values.`;
      }
    }
    
    return `🔍 **Code Review:** \nI reviewed your sandbox code and standard log outputs. Make sure you don't have mismatched quotes, uneven spaces (IndentationError), or spelling mistakes. If the logs are empty, click the green **"Run Code"** button to compile first!`;
  }
  
  // Check lesson explanation
  if (query.includes('explain') || query.includes('lesson') || query.includes('what is') || query.includes('concept')) {
    if (topic.id === 'syntax') {
      return `📚 **Python Syntax Summary:**\n- Executes line by line.\n- Comments start with the \`#\` symbol.\n- Code structures and loops *require* colon signs (\`:\`) at the end of definitions.\n- Indented spaces (4 spaces recommended) form structural scope blocks.`;
    }
    if (topic.id === 'variables') {
      return `📚 **Variables and Types Summary:**\n- Assigned using a single \`=\` sign.\n- No need to define static data types (dynamic typing).\n- Built-in functions like \`type(my_var)\` let you discover if a variable is an integer, float, string, or boolean.`;
    }
    if (topic.id === 'operators') {
      return `📚 **Operators Summary:**\n- Arithmetic: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulus), \`**\` (power), \`//\` (floor).\n- Comparison: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.\n- Logical: \`and\`, \`or\`, \`not\` to bind multiple check constraints together.`;
    }
    if (topic.id === 'collections') {
      return `📚 **Data Collections Summary:**\n- **Lists**: Defined by \`[]\`, ordered, index-based, and mutable. Edit elements with \`my_list.append()\` or \`my_list[0] = value\`.\n- **Dictionaries**: Defined by \`{}\`, map keys to values (e.g., \`{"name": "Alice"}\`).`;
    }
    return `📚 **Topic Insights:** \nYou are learning **${topic.title}**. This is an essential aspect of W3Schools Python core modules. Let's write some code in the compiler playground and test how Python behaves!`;
  }
  
  // Custom custom practice challenges
  if (query.includes('challenge') || query.includes('exercise') || query.includes('practice')) {
    if (topic.id === 'syntax') {
      return `💡 **Practice Challenge:** \nModify the sandbox playground script to evaluate: if \`10 > 20\`, output "True", otherwise (else block) output "False". Give it a run!`;
    }
    if (topic.id === 'variables') {
      return `💡 **Practice Challenge:** \nAssign your name to a variable \`my_name\`, and age to \`my_age\`. Print them on a single line formatted as "Hello, my name is ... and I am ... years old" using string concatenation.`;
    }
    if (topic.id === 'operators') {
      return `💡 **Practice Challenge:** \nWrite a statement that calculates the area of a circle with a radius of \`7\` (Formula: \`area = 3.14 * radius ** 2\`) and prints the result.`;
    }
    if (topic.id === 'collections') {
      return `💡 **Practice Challenge:** \nCreate a dictionary representing an item in a cart, with keys \`name\`, \`price\`, and \`quantity\`. Increment the quantity value by 1, and print the updated dictionary.`;
    }
    return `💡 **Practice Challenge:** \nTry editing the current workspace program, add an if-condition check, and run the file using the terminal execution module.`;
  }
  
  // Generic responsive answers
  return `Hi there! I am your offline Pyacademy Mentor. 
- Ask me to **"explain the lesson"** to get a clear summary of ${topic.title}.
- Ask me to **"debug my code"** to audit your playground main.py code.
- Ask me to **"give a challenge"** to test your python skills.
- *Tip:* Input a Google Gemini API Key in **Settings** (gear icon) to unlock fully dynamic conversations!`;
}

// --------------------------------------------------------------------------
// Settings Modal Logic
// --------------------------------------------------------------------------
function toggleSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.classList.toggle('active');
}

function saveSettings() {
  const key = document.getElementById('gemini-api-key').value.trim();
  state.apiKey = key;
  
  if (key) {
    localStorage.setItem('pyacademy_gemini_key', key);
    updateApiBadge(true);
    appendBotMessage("Gemini API Key successfully linked! I am now running on fully-capable AI tutoring protocols. Ask me anything!");
  } else {
    localStorage.removeItem('pyacademy_gemini_key');
    updateApiBadge(false);
    appendBotMessage("Gemini API Key cleared. Reverted to local rule-based tutor assistant.");
  }
  
  toggleSettingsModal();
}
