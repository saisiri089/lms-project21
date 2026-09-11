/* =========================================================
   LEARNHUB LMS - MAIN JAVASCRIPT
   ========================================================= */

/* =========================================================
   1. GLOBAL SETTINGS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("LearnHub LMS JavaScript loaded successfully.");

    /* Run functions for different pages */
    handleRegistration();
    handleLogin();
    handleCourseFilters();
    handleCoupon();
    handlePayment();
    handleDashboard();
    handleLesson();
    handleProfile();
    handleContact();
    handleFAQ();
    handleLogout();
    updateUserName();
    protectPages();

});


/* =========================================================
   2. HELPER FUNCTIONS
   ========================================================= */

/*
   Get element safely
*/
function getElement(id) {
    return document.getElementById(id);
}


/*
   Show error message
*/
function showError(elementId, message) {
    const element = getElement(elementId);

    if (element) {
        element.textContent = message;
        element.style.display = "block";
    }
}


/*
   Clear error message
*/
function clearError(elementId) {
    const element = getElement(elementId);

    if (element) {
        element.textContent = "";
        element.style.display = "none";
    }
}


/*
   Get stored user
*/
function getStoredUser() {
    const user = localStorage.getItem("learnhubUser");

    if (user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            return null;
        }
    }

    return null;
}


/*
   Save user
*/
function saveUser(user) {
    localStorage.setItem("learnhubUser", JSON.stringify(user));
}


/*
   Check whether user is logged in
*/
function isLoggedIn() {
    return localStorage.getItem("learnhubLoggedIn") === "true";
}


/*
   Get current page name
*/
function getCurrentPage() {
    return window.location.pathname.split("/").pop();
}


/* =========================================================
   3. REGISTRATION
   ========================================================= */

function handleRegistration() {

    const registerForm = getElement("registerForm");

    /*
       If register form doesn't exist,
       stop this function.
    */
    if (!registerForm) {
        return;
    }


    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;


        /* Get values */

        const fullName = getElement("fullName")?.value.trim() || "";
        const email = getElement("email")?.value.trim() || "";
        const phone = getElement("phone")?.value.trim() || "";
        const password = getElement("password")?.value || "";
        const confirmPassword = getElement("confirmPassword")?.value || "";
        const terms = getElement("terms");


        /* Clear previous errors */

        clearError("fullNameError");
        clearError("emailError");
        clearError("phoneError");
        clearError("passwordError");
        clearError("confirmPasswordError");
        clearError("termsError");


        /* Full name validation */

        if (fullName.length < 3) {

            showError(
                "fullNameError",
                "Please enter your full name."
            );

            isValid = false;
        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showError(
                "emailError",
                "Please enter a valid email address."
            );

            isValid = false;
        }


        /* Phone validation */

        const cleanPhone = phone.replace(/\D/g, "");

        if (
            cleanPhone.length !== 10 &&
            cleanPhone.length !== 12
        ) {

            showError(
                "phoneError",
                "Please enter a valid phone number."
            );

            isValid = false;
        }


        /* Password validation */

        if (password.length < 6) {

            showError(
                "passwordError",
                "Password must contain at least 6 characters."
            );

            isValid = false;
        }


        /* Confirm password */

        if (password !== confirmPassword) {

            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );

            isValid = false;
        }


        /* Terms */

        if (terms && !terms.checked) {

            showError(
                "termsError",
                "Please accept the terms and conditions."
            );

            isValid = false;
        }


        /* If everything is valid */

        if (isValid) {

            const user = {
                name: fullName,
                email: email,
                phone: phone,
                password: password
            };


            saveUser(user);

            localStorage.setItem(
                "learnhubLoggedIn",
                "false"
            );


            alert(
                "Registration successful! Please login."
            );


            window.location.href = "login.html";
        }

    });

}


/* =========================================================
   4. LOGIN
   ========================================================= */

function handleLogin() {

    const loginForm = getElement("loginForm");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            getElement("loginEmail")?.value.trim() || "";

        const password =
            getElement("loginPassword")?.value || "";


        /* Clear errors */

        clearError("loginEmailError");
        clearError("loginPasswordError");


        let isValid = true;


        /* Email */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showError(
                "loginEmailError",
                "Please enter a valid email."
            );

            isValid = false;
        }


        /* Password */

        if (password.length < 6) {

            showError(
                "loginPasswordError",
                "Password must contain at least 6 characters."
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        /*
           Get registered user
        */

        const user = getStoredUser();


        /*
           Demo login credentials
           Useful when testing the project
        */

        const demoEmail = "demo@learnhub.com";
        const demoPassword = "123456";


        let loginSuccess = false;


        /* Registered user login */

        if (
            user &&
            email === user.email &&
            password === user.password
        ) {

            loginSuccess = true;

            localStorage.setItem(
                "learnhubCurrentUser",
                JSON.stringify(user)
            );
        }


        /*
           Demo account login
        */

        else if (
            email === demoEmail &&
            password === demoPassword
        ) {

            loginSuccess = true;

            const demoUser = {
                name: "Demo Student",
                email: demoEmail,
                phone: ""
            };

            localStorage.setItem(
                "learnhubCurrentUser",
                JSON.stringify(demoUser)
            );
        }


        /*
           Login successful
        */

        if (loginSuccess) {

            localStorage.setItem(
                "learnhubLoggedIn",
                "true"
            );


            alert("Login successful!");


            window.location.href =
                "dashboard.html";

        }

        else {

            showError(
                "loginPasswordError",
                "Incorrect email or password."
            );

        }

    });

}


/* =========================================================
   5. COURSE SEARCH AND FILTER
   ========================================================= */

function handleCourseFilters() {

    const searchInput =
        getElement("courseSearch");

    const categoryFilter =
        getElement("categoryFilter");

    const levelFilter =
        getElement("levelFilter");


    /*
       If none of these elements exist,
       this is not the courses page.
    */

    if (
        !searchInput &&
        !categoryFilter &&
        !levelFilter
    ) {
        return;
    }


    const courseCards =
        document.querySelectorAll(".course-card");

    const noCoursesMessage =
        getElement("noCoursesMessage");


    function filterCourses() {

        const searchText =
            searchInput?.value.toLowerCase().trim() || "";

        const selectedCategory =
            categoryFilter?.value.toLowerCase() || "all";

        const selectedLevel =
            levelFilter?.value.toLowerCase() || "all";


        let visibleCourses = 0;


        courseCards.forEach(function (card) {

            const cardText =
                card.textContent.toLowerCase();

            const cardCategory =
                card.dataset.category?.toLowerCase() || "";

            const cardLevel =
                card.dataset.level?.toLowerCase() || "";


            const matchesSearch =
                cardText.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                cardCategory === selectedCategory;

            const matchesLevel =
                selectedLevel === "all" ||
                cardLevel === selectedLevel;


            if (
                matchesSearch &&
                matchesCategory &&
                matchesLevel
            ) {

                card.style.display = "";

                visibleCourses++;

            }

            else {

                card.style.display = "none";

            }

        });


        /*
           Show "No courses found"
        */

        if (noCoursesMessage) {

            if (visibleCourses === 0) {

                noCoursesMessage.style.display = "block";

            }

            else {

                noCoursesMessage.style.display = "none";

            }

        }

    }


    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterCourses
        );
    }


    if (categoryFilter) {
        categoryFilter.addEventListener(
            "change",
            filterCourses
        );
    }


    if (levelFilter) {
        levelFilter.addEventListener(
            "change",
            filterCourses
        );
    }

}


/* =========================================================
   6. COUPON SYSTEM
   ========================================================= */

function handleCoupon() {

    /*
       Different possible IDs/classes are supported
       so this JS can work with the payment page.
    */

    const couponInput =
        getElement("couponCode") ||
        getElement("couponInput");

    const couponButton =
        getElement("applyCoupon") ||
        getElement("applyCouponBtn");

    const couponMessage =
        getElement("couponMessage");


    if (!couponInput || !couponButton) {
        return;
    }


    couponButton.addEventListener(
        "click",
        function () {

            const coupon =
                couponInput.value.trim().toUpperCase();


            if (!coupon) {

                if (couponMessage) {
                    couponMessage.textContent =
                        "Please enter a coupon code.";
                }

                return;
            }


            /*
               Sample coupon codes
            */

            const coupons = {

                "LEARN10": {
                    type: "percent",
                    value: 10
                },

                "SAVE100": {
                    type: "fixed",
                    value: 100
                },

                "WELCOME50": {
                    type: "fixed",
                    value: 50
                }

            };


            const selectedCoupon =
                coupons[coupon];


            if (!selectedCoupon) {

                if (couponMessage) {

                    couponMessage.textContent =
                        "Invalid coupon code.";

                }

                return;
            }


            localStorage.setItem(
                "learnhubCoupon",
                JSON.stringify({
                    code: coupon,
                    ...selectedCoupon
                })
            );


            if (couponMessage) {

                couponMessage.textContent =
                    `Coupon ${coupon} applied successfully!`;

            }


            /*
               Update payment amount
            */

            updatePaymentTotal();

        }
    );

}


/* =========================================================
   7. PAYMENT TOTAL
   ========================================================= */

function updatePaymentTotal() {

    /*
       Try to find price elements.
    */

    const priceElement =
        document.querySelector(
            ".summary-total, #summaryTotal, #totalAmount"
        );


    if (!priceElement) {
        return;
    }


    /*
       Extract number from price text
    */

    const priceText =
        priceElement.textContent.replace(/[^\d.]/g, "");


    let originalPrice =
        parseFloat(priceText);


    if (isNaN(originalPrice)) {
        originalPrice = 999;
    }


    let finalPrice =
        originalPrice;


    const storedCoupon =
        localStorage.getItem("learnhubCoupon");


    if (storedCoupon) {

        try {

            const coupon =
                JSON.parse(storedCoupon);


            if (coupon.type === "percent") {

                finalPrice =
                    originalPrice -
                    (originalPrice * coupon.value / 100);

            }


            else if (coupon.type === "fixed") {

                finalPrice =
                    originalPrice -
                    coupon.value;

            }


            if (finalPrice < 0) {
                finalPrice = 0;
            }

        }

        catch (error) {

            console.log(
                "Coupon data could not be loaded."
            );

        }

    }


    priceElement.textContent =
        `₹${Math.round(finalPrice)}`;

}


/* =========================================================
   8. PAYMENT
   ========================================================= */

function handlePayment() {

    const paymentForm =
        getElement("paymentForm");


    if (!paymentForm) {
        return;
    }


    paymentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /*
               Demo payment only.
               No real payment information is processed.
            */

            const payButton =
                paymentForm.querySelector(
                    "button[type='submit']"
                );


            if (payButton) {

                payButton.disabled = true;

                payButton.textContent =
                    "Processing...";

            }


            /*
               Save enrollment information
            */

            const courseTitle =
                document.querySelector(
                    ".payment-course-title"
                )?.textContent ||
                "Full Stack Web Development";


            const enrollment = {

                course: courseTitle,

                price: 999,

                date:
                    new Date().toLocaleDateString(),

                status: "Enrolled",

                progress: 0

            };


            localStorage.setItem(
                "learnhubEnrollment",
                JSON.stringify(enrollment)
            );


            /*
               Simulate payment processing
            */

            setTimeout(function () {

                window.location.href =
                    "payment-success.html";

            }, 1500);

        }
    );

}


/* =========================================================
   9. DASHBOARD
   ========================================================= */

function handleDashboard() {

    const dashboard =
        document.querySelector(".dashboard");


    /*
       Dashboard may not have a special wrapper.
       So we also check the filename.
    */

    if (
        !dashboard &&
        getCurrentPage() !== "dashboard.html"
    ) {
        return;
    }


    /*
       Load saved enrollment
    */

    const enrollmentData =
        localStorage.getItem(
            "learnhubEnrollment"
        );


    if (enrollmentData) {

        try {

            const enrollment =
                JSON.parse(enrollmentData);


            /*
               Update course title
            */

            const courseTitle =
                document.querySelector(
                    ".dashboard-course-title"
                );


            if (courseTitle) {

                courseTitle.textContent =
                    enrollment.course;

            }


            /*
               Update progress bars
            */

            const progressBars =
                document.querySelectorAll(
                    ".progress-fill"
                );


            progressBars.forEach(function (bar) {

                bar.style.width =
                    enrollment.progress + "%";

            });


        }

        catch (error) {

            console.log(
                "Enrollment data error."
            );

        }

    }

}


/* =========================================================
   10. UPDATE USER NAME
   ========================================================= */

function updateUserName() {

    const currentUser =
        localStorage.getItem(
            "learnhubCurrentUser"
        );


    if (!currentUser) {
        return;
    }


    try {

        const user =
            JSON.parse(currentUser);


        /*
           Support multiple possible user-name elements
        */

        const nameElements =
            document.querySelectorAll(
                "#studentName, #dashboardUserName, .student-name, .user-name"
            );


        nameElements.forEach(function (element) {

            element.textContent =
                user.name;

        });


        /*
           Email
        */

        const emailElements =
            document.querySelectorAll(
                "#studentEmail, .student-email, .user-email"
            );


        emailElements.forEach(function (element) {

            element.textContent =
                user.email;

        });

    }

    catch (error) {

        console.log(
            "Unable to load user information."
        );

    }

}


/* =========================================================
   11. LESSON PAGE
   ========================================================= */

function handleLesson() {

    const lessonPage =
        getCurrentPage() === "lesson.html";


    if (!lessonPage) {
        return;
    }


    /*
       Lesson completion button
    */

    const completeButton =
        getElement("completeLessonBtn") ||
        getElement("markCompleteBtn");


    if (completeButton) {

        completeButton.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "lessonCompleted",
                    "true"
                );


                completeButton.textContent =
                    "✓ Lesson Completed";


                completeButton.disabled =
                    true;


                updateLessonProgress();

            }
        );

    }


    /*
       Video completion
    */

    const video =
        document.querySelector("video");


    if (video) {

        video.addEventListener(
            "ended",
            function () {

                localStorage.setItem(
                    "lessonCompleted",
                    "true"
                );


                updateLessonProgress();

            }
        );

    }


    /*
       Load notes
    */

    const notes =
        getElement("lessonNotes") ||
        getElement("notes");


    const saveNotesButton =
        getElement("saveNotesBtn") ||
        getElement("saveNotes");


    if (notes) {

        const savedNotes =
            localStorage.getItem(
                "learnhubLessonNotes"
            );


        if (savedNotes) {

            notes.value =
                savedNotes;

        }

    }


    if (saveNotesButton && notes) {

        saveNotesButton.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "learnhubLessonNotes",
                    notes.value
                );


                alert(
                    "Notes saved successfully!"
                );

            }
        );

    }


    /*
       Load completed status
    */

    const completed =
        localStorage.getItem(
            "lessonCompleted"
        );


    if (
        completed === "true" &&
        completeButton
    ) {

        completeButton.textContent =
            "✓ Lesson Completed";

        completeButton.disabled =
            true;

    }

}


/* =========================================================
   12. UPDATE LESSON PROGRESS
   ========================================================= */

function updateLessonProgress() {

    const progress =
        document.querySelector(
            ".progress-fill"
        );


    if (progress) {

        progress.style.width =
            "100%";

    }


    const progressText =
        document.querySelector(
            ".progress-text"
        );


    if (progressText) {

        progressText.textContent =
            "100% Complete";

    }


    /*
       Save dashboard progress
    */

    const enrollmentData =
        localStorage.getItem(
            "learnhubEnrollment"
        );


    if (enrollmentData) {

        try {

            const enrollment =
                JSON.parse(enrollmentData);


            enrollment.progress = 100;


            localStorage.setItem(
                "learnhubEnrollment",
                JSON.stringify(enrollment)
            );

        }

        catch (error) {

            console.log(
                "Could not update progress."
            );

        }

    }

}


/* =========================================================
   13. PROFILE
   ========================================================= */

function handleProfile() {

    const profileForm =
        getElement("profileForm");


    /*
       If profile form doesn't exist,
       stop.
    */

    if (!profileForm) {
        return;
    }


    /*
       Load user information
    */

    const user =
        getStoredUser();


    if (user) {

        const nameInput =
            getElement("profileName");

        const emailInput =
            getElement("profileEmail");

        const phoneInput =
            getElement("profilePhone");


        if (nameInput) {
            nameInput.value =
                user.name || "";
        }


        if (emailInput) {
            emailInput.value =
                user.email || "";
        }


        if (phoneInput) {
            phoneInput.value =
                user.phone || "";
        }

    }


    /*
       Save profile
    */

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                getElement("profileName")?.value.trim() ||
                "";

            const phone =
                getElement("profilePhone")?.value.trim() ||
                "";


            if (name.length < 3) {

                alert(
                    "Please enter a valid name."
                );

                return;

            }


            const currentUser =
                getStoredUser();


            if (!currentUser) {
                return;
            }


            currentUser.name =
                name;

            currentUser.phone =
                phone;


            saveUser(currentUser);


            localStorage.setItem(
                "learnhubCurrentUser",
                JSON.stringify(currentUser)
            );


            alert(
                "Profile updated successfully!"
            );


            updateUserName();

        }
    );


    /*
       Password change
    */

    const passwordForm =
        getElement("passwordForm");


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const currentPassword =
                    getElement("currentPassword")?.value ||
                    "";

                const newPassword =
                    getElement("newPassword")?.value ||
                    "";

                const confirmNewPassword =
                    getElement("confirmNewPassword")?.value ||
                    "";


                const user =
                    getStoredUser();


                if (!user) {
                    return;
                }


                if (
                    currentPassword !==
                    user.password
                ) {

                    alert(
                        "Current password is incorrect."
                    );

                    return;

                }


                if (newPassword.length < 6) {

                    alert(
                        "New password must contain at least 6 characters."
                    );

                    return;

                }


                if (
                    newPassword !==
                    confirmNewPassword
                ) {

                    alert(
                        "New passwords do not match."
                    );

                    return;

                }


                user.password =
                    newPassword;


                saveUser(user);


                alert(
                    "Password changed successfully!"
                );


                passwordForm.reset();

            }
        );

    }

}


/* =========================================================
   14. CONTACT FORM
   ========================================================= */

function handleContact() {

    const contactForm =
        getElement("contactForm");


    if (!contactForm) {
        return;
    }


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let isValid = true;


            const name =
                getElement("contactName")?.value.trim() ||
                "";

            const email =
                getElement("contactEmail")?.value.trim() ||
                "";

            const subject =
                getElement("contactSubject")?.value.trim() ||
                "";

            const message =
                getElement("contactMessage")?.value.trim() ||
                "";


            /*
               Clear errors
            */

            clearError("contactNameError");
            clearError("contactEmailError");
            clearError("contactSubjectError");
            clearError("contactMessageError");


            /*
               Name
            */

            if (name.length < 3) {

                showError(
                    "contactNameError",
                    "Please enter your name."
                );

                isValid = false;

            }


            /*
               Email
            */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showError(
                    "contactEmailError",
                    "Please enter a valid email."
                );

                isValid = false;

            }


            /*
               Subject
            */

            if (subject.length < 3) {

                showError(
                    "contactSubjectError",
                    "Please enter a subject."
                );

                isValid = false;

            }


            /*
               Message
            */

            if (message.length < 10) {

                showError(
                    "contactMessageError",
                    "Message must contain at least 10 characters."
                );

                isValid = false;

            }


            if (!isValid) {
                return;
            }


            /*
               Show success message
            */

            const successMessage =
                getElement(
                    "contactSuccessMessage"
                );


            if (successMessage) {

                successMessage.textContent =
                    "Your message has been sent successfully!";

                successMessage.style.display =
                    "block";

            }

            else {

                alert(
                    "Your message has been sent successfully!"
                );

            }


            /*
               Clear form
            */

            contactForm.reset();

        }
    );

}


/* =========================================================
   15. FAQ ACCORDION
   ========================================================= */

function handleFAQ() {

    const faqQuestions =
        document.querySelectorAll(
            ".faq-question"
        );


    if (faqQuestions.length === 0) {
        return;
    }


    faqQuestions.forEach(function (question) {

        question.addEventListener(
            "click",
            function () {


                /*
                   Find answer
                */

                const faqItem =
                    question.closest(
                        ".faq-item"
                    );


                if (!faqItem) {
                    return;
                }


                const answer =
                    faqItem.querySelector(
                        ".faq-answer"
                    );


                const icon =
                    faqItem.querySelector(
                        ".faq-icon"
                    );


                if (!answer) {
                    return;
                }


                /*
                   Check current state
                */

                const isOpen =
                    faqItem.classList.contains(
                        "active"
                    );


                /*
                   Close all FAQ items
                */

                document
                    .querySelectorAll(".faq-item")
                    .forEach(function (item) {

                        item.classList.remove(
                            "active"
                        );

                    });


                document
                    .querySelectorAll(".faq-answer")
                    .forEach(function (item) {

                        item.style.display =
                            "none";

                    });


                document
                    .querySelectorAll(".faq-icon")
                    .forEach(function (item) {

                        item.textContent =
                            "+";

                    });


                /*
                   Open selected FAQ
                */

                if (!isOpen) {

                    faqItem.classList.add(
                        "active"
                    );


                    answer.style.display =
                        "block";


                    if (icon) {

                        icon.textContent =
                            "−";

                    }

                }

            }
        );

    });

}


/* =========================================================
   16. LOGOUT
   ========================================================= */

function handleLogout() {

    /*
       Support buttons and links
       with logout class or ID
    */

    const logoutElements =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn, .logout-link"
        );


    logoutElements.forEach(function (element) {

        element.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {
                    return;
                }


                localStorage.setItem(
                    "learnhubLoggedIn",
                    "false"
                );


                localStorage.removeItem(
                    "learnhubCurrentUser"
                );


                window.location.href =
                    "index.html";

            }
        );

    });

}


/* =========================================================
   17. PAGE PROTECTION
   ========================================================= */

function protectPages() {

    const currentPage =
        getCurrentPage();


    /*
       Pages that require login
    */

    const protectedPages = [
        "dashboard.html",
        "lesson.html",
        "profile.html"
    ];


    if (
        protectedPages.includes(currentPage) &&
        !isLoggedIn()
    ) {

        alert(
            "Please login to access this page."
        );


        window.location.href =
            "login.html";

    }

}


/* =========================================================
   18. REMEMBER ME
   ========================================================= */

function setupRememberMe() {

    const rememberMe =
        getElement("rememberMe");


    if (!rememberMe) {
        return;
    }


    const savedEmail =
        localStorage.getItem(
            "learnhubRememberEmail"
        );


    if (savedEmail) {

        const emailInput =
            getElement("loginEmail");


        if (emailInput) {

            emailInput.value =
                savedEmail;

        }


        rememberMe.checked =
            true;

    }

}


setupRememberMe();


/* =========================================================
   19. SAVE REMEMBERED EMAIL
   ========================================================= */

function saveRememberedEmail() {

    const rememberMe =
        getElement("rememberMe");

    const emailInput =
        getElement("loginEmail");


    if (!rememberMe || !emailInput) {
        return;
    }


    if (rememberMe.checked) {

        localStorage.setItem(
            "learnhubRememberEmail",
            emailInput.value.trim()
        );

    }

    else {

        localStorage.removeItem(
            "learnhubRememberEmail"
        );

    }

}


/*
   Add listener to login form
*/

const loginFormForRemember =
    getElement("loginForm");


if (loginFormForRemember) {

    loginFormForRemember.addEventListener(
        "submit",
        function () {

            saveRememberedEmail();

        }
    );

}


/* =========================================================
   20. PASSWORD SHOW / HIDE
   ========================================================= */

function setupPasswordToggle() {

    const toggleButtons =
        document.querySelectorAll(
            ".password-toggle"
        );


    toggleButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const input =
                    button.parentElement.querySelector(
                        "input"
                    );


                if (!input) {
                    return;
                }


                if (input.type === "password") {

                    input.type =
                        "text";

                    button.textContent =
                        "Hide";

                }

                else {

                    input.type =
                        "password";

                    button.textContent =
                        "Show";

                }

            }
        );

    });

}


setupPasswordToggle();


/* =========================================================
   21. CURRENT YEAR
   ========================================================= */

function updateCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            ".current-year"
        );


    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });

}


updateCurrentYear();


/* =========================================================
   22. BACK TO TOP BUTTON
   ========================================================= */

function setupBackToTop() {

    const button =
        getElement("backToTop");


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 300) {

                button.style.display =
                    "block";

            }

            else {

                button.style.display =
                    "none";

            }

        }
    );


    button.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


setupBackToTop();


/* =========================================================
   END OF LEARNHUB JAVASCRIPT
   ========================================================= */

console.log(
    "LearnHub LMS JavaScript is ready."
);