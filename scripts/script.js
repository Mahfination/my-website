document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksLi = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked
    navLinksLi.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });

    // --- Animation on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });

    // --- Guide Generation Form ---
    const form = document.getElementById('guide-form');
    const resultsDiv = document.getElementById('results');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const age = parseInt(document.getElementById('age').value);
            const appType = document.getElementById('appType').value;
            const isGovt = document.getElementById('isGovt').value;
            resultsDiv.innerHTML = generateGuide(age, appType, isGovt);
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function generateGuide(age, appType, isGovt) {
        let primaryDoc = '';
        let documents = [];
        if (age < 18) {
            primaryDoc = 'অনলাইন জন্মনিবন্ধন সনদ (BRC English Version)';
            documents.push('পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) কপি');
            if (age < 6) { documents.push('<span class="highlight">3R সাইজের গ্রে ব্যাকগ্রাউন্ডের ল্যাব প্রিন্ট ছবি</span>'); }
        } else if (age >= 18 && age <= 20) {
            primaryDoc = 'জাতীয় পরিচয়পত্র (NID) অথবা অনলাইন জন্মনিবন্ধন সনদ (BRC English Version) (তবে NID দেওয়া উত্তম)';
        } else {
            primaryDoc = 'জাতীয় পরিচয়পত্র (NID) - <span class="highlight">আবশ্যক</span>';
        }
        if (appType === 'reissue') {
            documents.unshift('পুরাতন পাসপোর্টের মূল কপি ও ডাটা পেজের ফটোকপি');
        } else if (appType === 'lost') {
            documents.unshift('<span class="highlight">থানায় করা সাধারণ ডায়েরি (GD)-র মূল কপি</span>');
            documents.push('হারিয়ে যাওয়া পাসপোর্টের ফটোকপি (যদি থাকে)');
        }
        if (isGovt === 'yes') { documents.push('অনাপত্তিপত্র (NOC)/সরকারি আদেশ (GO)/অবসরোত্তর ছুটির আদেশ (PRL)'); }
        let policeVerificationStep = (appType === 'new') ? '<li><strong>পুলিশ ভেরিফিকেশন:</strong> আপনার বর্তমান ও স্থায়ী ঠিকানায় পুলিশ ভেরিফিকেশন হবে।</li>' : '<li><strong>পুলিশ ভেরিফিকেশন:</strong> পাসপোর্ট নবায়ন বা রি-ইস্যুর ক্ষেত্রে সাধারণত পুলিশ ভেরিফিকেশন হয় না।</li>';
        let feeAdvice = (isGovt === 'yes') ? '<p class="tip">💡 <strong>বিশেষ সুবিধা:</strong> সরকারি চাকরিজীবী হওয়ায় আপনি সাধারণ ফি দিয়ে জরুরি সেবা এবং জরুরি ফি দিয়ে অতি জরুরি সেবা পাবেন।</p>' : '';
        let warnings = `<h3>❌ যা যা করবেন না</h3><ul><li>আবেদন ফরমে আপনার NID বা BRC-এর সাথে তথ্যের গরমিল করবেন না।</li><li>কোনো দালালের সাহায্য নিবেন না।</li><li>মূল কাগজপত্র লেমিনেটিং করবেন না।</li></ul>`;
        return `<h3>আপনার জন্য নির্ধারিত গাইড</h3><h4>📄 প্রয়োজনীয় কাগজপত্র:</h4><ul><li><strong>মূল ডকুমেন্ট:</strong> ${primaryDoc}</li>${documents.map(doc => `<li>${doc}</li>`).join('')}</ul>${feeAdvice}<h4>➡️ করণীয় (ধাপে ধাপে):</h4><ol><li><strong>অনলাইন আবেদন পূরণ:</strong> <a href="https://www.epassport.gov.bd/landing" target="_blank">ই-পাসপোর্ট ওয়েবসাইটে</a> যান।</li><li><strong>ফি পরিশোধ:</strong> সুবিধামত ফি অনলাইন বা ব্যাংকে এ-চালানের মাধ্যমে জমা দিন।</li><li><strong>অফিসে কাগজপত্র জমা ও বায়োমেট্রিক্স:</strong> আবেদনপত্রের প্রিন্ট কপি, ফি জমার রশিদ এবং সকল কাগজপত্রের মূল ও ফটোকপি নিয়ে পাসপোর্ট অফিসে যান।</li>${policeVerificationStep}<li><strong>পাসপোর্ট সংগ্রহ:</strong> মোবাইলে SMS আসলে, ডেলিভারি স্লিপটি নিয়ে পাসপোর্ট সংগ্রহ করুন।</li></ol>${warnings}`;
    }
});