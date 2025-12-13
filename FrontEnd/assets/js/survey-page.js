// document.addEventListener("DOMContentLoaded", () => {
//     const surveys = document.querySelectorAll(".main-survey");

//     // semua tombol "Lanjut" diproses
//     const nextButtons = document.querySelectorAll(".btn-survey");

//     nextButtons.forEach(btn => {
//         btn.addEventListener("click", (e) => {
//             e.preventDefault();

//             const targetID = btn.getAttribute("href").replace("#", "");
//             const target = document.getElementById(targetID);

//             // nonaktifkan semua
//             surveys.forEach(s => s.classList.remove("active"));

//             // tampilkan target
//             if (target) target.classList.add("active");

//             // scroll ke atas
//             window.scrollTo({ top: 0, behavior: "smooth" });
//         });
//     });
// });
