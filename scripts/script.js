document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle the guide generation form
    const form = document.getElementById('guide-form');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get user inputs
        const age = parseInt(document.getElementById('age').value);
        const appType = document.getElementById('appType').value;
        const isGovt = document.getElementById('isGovt').value;

        // Generate the guide HTML
        const guideHTML = generateGuide(age, appType, isGovt);
        
        // Display the results
        resultsDiv.innerHTML = guideHTML;
        resultsDiv.classList.remove('hidden');

        // Scroll to the results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // The core logic function
    function generateGuide(age, appType, isGovt) {
        let primaryDoc = '';
        let documents = [];
        let processSteps = '';
        let warnings = '';
        
        // 1. Determine Primary Document based on Age
        if (age < 18) {
            primaryDoc = 'অনলাইন জন্মনিবন্ধন সনদ (BRC English Version)';
            documents.push('পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) কপি');
            if (age < 6) {
                documents.push('<span class="highlight">3R সাইজের গ্রে ব্যাকগ্রাউন্ডের ল্যাব প্রিন্ট ছবি</span>');
            }
        } else if (age >= 18 && age <= 20) {
            primaryDoc = 'জাতীয় পরিচয়পত্র (NID) অথবা অনলাইন জন্মনিবন্ধন সনদ (BRC English Version) (তবে NID দেওয়া উত্তম)';
        } else { // age > 20
            primaryDoc = 'জাতীয় পরিচয়পত্র (NID) - <span class="highlight">আবশ্যক</span>';
        }

        // 2. Add documents based on Application Type
        if (appType === 'reissue') {
            documents.unshift('পুরাতন পাসপোর্টের মূল কপি ও ডাটা পেজের ফটোকপি');
        } else if (appType === 'lost') {
            documents.unshift('<span class="highlight">থানায় করা সাধারণ ডায়েরি (GD)-র মূল কপি</span>');
            documents.push('হারিয়ে যাওয়া পাসপোর্টের ফটোকপি (যদি থাকে)');
        }

        // 3. Add documents for special cases
        if (isGovt === 'yes') {
            documents.push('অনাপত্তিপত্র (NOC)/সরকারি আদেশ (GO)/অবসরোত্তর ছুটির আদেশ (PRL)');
        }
        
        // 4. Generate Process Steps
        let policeVerificationStep = '';
        if (appType === 'new') {
            policeVerificationStep = '<li><strong>পুলিশ ভেরিফিকেশন:</strong> আপনার বর্তমান ও স্থায়ী ঠিকানায় পুলিশ ভেরিফিকেশন হবে। পুলিশ কর্মকর্তার সাথে যোগাযোগ রাখুন। অতি জরুরি আবেদনের ক্ষেত্রে, <span class="highlight">আপনাকে নিজ উদ্যোগে পুলিশ ক্লিয়ারেন্স সনদ সংগ্রহ করে আবেদনের সাথে জমা দিতে হবে।</span></li>';
        } else {
             policeVerificationStep = '<li><strong>পুলিশ ভেরিফিকেশন:</strong> পাসপোর্ট নবায়ন বা রি-ইস্যুর ক্ষেত্রে সাধারণত পুলিশ ভেরিফিকেশন হয় না।</li>';
        }

        let feeAdvice = (isGovt === 'yes') 
            ? '<p class="tip">💡 <strong>বিশেষ সুবিধা:</strong> সরকারি চাকরিজীবী হওয়ায় আপনি সাধারণ ফি দিয়ে জরুরি সেবা এবং জরুরি ফি দিয়ে অতি জরুরি সেবা পাবেন। ফি পরিশোধের সময় এটি উল্লেখ করুন।</p>' 
            : '';

        // 5. Generate Warnings/Tips
        warnings = `
            <h3>❌ যা যা করবেন না</h3>
            <ul>
                <li>আবেদন ফরমে আপনার NID বা BRC-এর সাথে তথ্যের গরমিল করবেন না।</li>
                <li>কোনো দালালের সাহায্য নিবেন না। পুরো প্রক্রিয়াটি এখন অনেক সহজ।</li>
                <li>মূল কাগজপত্র (NID, BRC, আগের পাসপোর্ট) লেমিনেটিং করবেন না।</li>
                <li>ভুল বা মিথ্যা তথ্য প্রদান করবেন না, এতে আপনার আবেদন বাতিল হতে পারে।</li>
            </ul>
        `;

        // Assemble the final HTML
        return `
            <h3>আপনার জন্য নির্ধারিত গাইড (বয়স: ${age}, ধরন: ${appType === 'new' ? 'নতুন' : (appType === 'reissue' ? 'নবায়ন' : 'হারানো')})</h3>
            
            <h3>📄 আপনার প্রয়োজনীয় কাগজপত্র:</h3>
            <ul>
                <li><strong>মূল ডকুমেন্ট:</strong> ${primaryDoc}</li>
                ${documents.map(doc => `<li>${doc}</li>`).join('')}
                <li>আপনার সকল কাগজপত্রের মূল কপির সাথে এক সেট ফটোকপিও নিয়ে যাবেন।</li>
            </ul>
            
            ${feeAdvice}

            <h3>➡️ আপনার করণীয় (ধাপে ধাপে):</h3>
            <ol>
                <li><strong>অনলাইন আবেদন পূরণ:</strong> <a href="https://www.epassport.gov.bd/landing" target="_blank">ই-পাসপোর্ট ওয়েবসাইটে</a> যান। <span class="highlight">আপনার ${primaryDoc.includes('NID') ? 'NID' : 'BRC'} অনুযায়ী সকল তথ্য হুবহু পূরণ করুন।</span> বর্তমান ঠিকানা অনুযায়ী আপনার পাসপোর্ট অফিস নির্বাচিত হবে।</li>
                <li><strong>ফি পরিশোধ:</strong> আপনার সুবিধামত (সাধারণ/জরুরি/অতি জরুরি) ফি অনলাইন (bKash, Nagad, Card) অথবা ব্যাংকে এ-চালানের মাধ্যমে জমা দিয়ে রশিদ সংগ্রহ করুন।</li>
                <li><strong>অফিসে কাগজপত্র জমা ও বায়োমেট্রিক্স:</strong> আবেদনপত্রের প্রিন্ট কপি, ফি জমার রশিদ এবং উপরে উল্লেখিত সকল কাগজপত্রের মূল ও ফটোকপি নিয়ে নির্ধারিত তারিখে পাসপোর্ট অফিসে যান। ছবি তোলা, আঙুলের ছাপ ও ডিজিটাল স্বাক্ষর নেওয়া হবে।</li>
                ${policeVerificationStep}
                <li><strong>পাসপোর্ট সংগ্রহ:</strong> আপনার মোবাইলে পাসপোর্ট প্রস্তুত হওয়ার SMS আসলে, ডেলিভারি স্লিপটি নিয়ে পাসপোর্ট অফিস থেকে আপনার নতুন ই-পাসপোর্ট সংগ্রহ করুন।</li>
            </ol>
            
            ${warnings}
        `;
    }
});