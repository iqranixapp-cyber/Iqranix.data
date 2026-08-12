/* =========================================================
   IQRANIX — PREMIUM PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BACK BUTTON
       ===================================================== */

    const backButton = document.getElementById("backButton");

    if (backButton) {
        backButton.addEventListener("click", () => {

            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "index.html";
            }

        });
    }


    /* =====================================================
       PREMIUM BUTTON
       ===================================================== */

    const premiumButton =
        document.getElementById("premiumButton") ||
        document.querySelector(".premium-button");

    if (premiumButton) {

        premiumButton.addEventListener("click", () => {

            /*
             * Payment system can be connected here later.
             *
             * For now, IQRANIX Premium is being prepared.
             */

            showToast(
                "IQRANIX Premium is coming soon."
            );

        });

    }


    /* =====================================================
       PREMIUM BENEFIT ANIMATION
       ===================================================== */

    const benefitCards =
        document.querySelectorAll(".benefit-card");

    benefitCards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 100 + (index * 80));

    });


    /* =====================================================
       PREMIUM BUTTON PRESS EFFECT
       ===================================================== */

    if (premiumButton) {

        premiumButton.addEventListener("mousedown", () => {
            premiumButton.style.transform = "scale(0.97)";
        });

        premiumButton.addEventListener("mouseup", () => {
            premiumButton.style.transform = "";
        });

        premiumButton.addEventListener("mouseleave", () => {
            premiumButton.style.transform = "";
        });

        premiumButton.addEventListener("touchstart", () => {
            premiumButton.style.transform = "scale(0.97)";
        }, {
            passive: true
        });

        premiumButton.addEventListener("touchend", () => {
            premiumButton.style.transform = "";
        });

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.getElementById("premiumToast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "premiumToast";

            toast.style.position = "fixed";
            toast.style.left = "50%";
            toast.style.bottom = "25px";
            toast.style.transform =
                "translateX(-50%) translateY(20px)";

            toast.style.zIndex = "9999";

            toast.style.padding =
                "13px 20px";

            toast.style.borderRadius =
                "50px";

            toast.style.color =
                "#ffffff";

            toast.style.background =
                "rgba(4,60,45,0.96)";

            toast.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.22)";

            toast.style.fontSize =
                "14px";

            toast.style.fontWeight =
                "700";

            toast.style.opacity = "0";

            toast.style.pointerEvents =
                "none";

            toast.style.transition =
                "opacity .3s ease, transform .3s ease";

            document.body.appendChild(toast);
        }


        toast.textContent = message;

        requestAnimationFrame(() => {

            toast.style.opacity = "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        });


        clearTimeout(toast._timer);

        toast._timer = setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

        }, 3000);

    }


    /* =====================================================
       PREVENT DOUBLE SUBMISSIONS
       ===================================================== */

    let isProcessing = false;

    if (premiumButton) {

        premiumButton.addEventListener("click", () => {

            if (isProcessing) return;

            isProcessing = true;

            setTimeout(() => {
                isProcessing = false;
            }, 1000);

        });

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       PAGE LOADED
       ===================================================== */

    console.log(
        "IQRANIX Premium page loaded successfully."
    );

});