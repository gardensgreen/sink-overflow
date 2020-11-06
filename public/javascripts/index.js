window.addEventListener("load", (event) => {
    console.log("hello from javascript!");

    const searchForm = document.querySelector(".search-form");
    console.log(searchForm);
    console.log("HELLLOOOO");
    const main = document.querySelector(".main");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const term = document.querySelector(".search-input").value;
        const body = {
            term,
        };

        try {
            let res = await fetch("/api/search/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            let parsedResponse = await res.json();
            console.log(parsedResponse);

            let { questions } = parsedResponse;

            if (questions.length === 0) {
                console.log("this got here");
                main.innerHTML = `<p>No Results Found</p>`;
            } else {
                let questionsHTML = "<ul>";
                for (let question of questions) {
                    questionsHTML += `<a href='/questions/${question.id}/'>
                                    <div class="questions-block">
                                        <div class="questions-block__content">
                                            <li class="question-block__content__title">${question.title}</li>
                                            <li class="question-block__content__question">${question.content}</li>
                                        </div>
                                    </div>
                                  </a>`;
                }
                questionsHTML += "</ul>";
                main.innerHTML = questionsHTML;
            }
        } catch (err) {
            console.error(err);
        }
    });

    let upArrows = document.querySelectorAll(".up-arrow");

    for (let upArrow of upArrows) {
        upArrow.addEventListener("click", async (e) => {
            e.preventDefault();

            const voteCountSpan = document.querySelector(
                `#vote-count-${e.target.dataset.questionid}`
            );

            try {
                const body = { isDownvote: false };
                let res = await fetch(
                    `/api/votes/questions/${e.target.dataset.questionid}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );

                console.log("yo wtf " + res.toString());
                if (!res.ok) throw res;
                let data = await res.json();
                console.log(data.voteCount);

                if (upArrow.classList.contains("voted")) {
                    upArrow.classList.remove("voted");
                } else {
                    if (
                        document
                            .querySelector(
                                `#down-arrow-${e.target.dataset.questionid}`
                            )
                            .classList.contains("voted")
                    ) {
                        document
                            .querySelector(
                                `#down-arrow-${e.target.dataset.questionid}`
                            )
                            .classList.remove("voted");
                    }
                    upArrow.classList.add("voted");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.log(parsedErr);
                } else {
                    console.log(err.message);
                }
            }
        });
    }

    let downArrows = document.querySelectorAll(".down-arrow");

    for (let downArrow of downArrows) {
        downArrow.addEventListener("click", async (e) => {
            e.preventDefault();

            const voteCountSpan = document.querySelector(
                `#vote-count-${e.target.dataset.questionid}`
            );

            try {
                const body = { isDownvote: true };
                let res = await fetch(
                    `/api/votes/questions/${e.target.dataset.questionid}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );

                console.log("yo wtf " + res.toString());
                if (!res.ok) throw res;
                let data = await res.json();
                console.log(data.voteCount);

                if (downArrow.classList.contains("voted")) {
                    downArrow.classList.remove("voted");
                } else {
                    if (
                        document
                            .querySelector(
                                `#up-arrow-${e.target.dataset.questionid}`
                            )
                            .classList.contains("voted")
                    ) {
                        document
                            .querySelector(
                                `#up-arrow-${e.target.dataset.questionid}`
                            )
                            .classList.remove("voted");
                    }
                    downArrow.classList.add("voted");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.log(parsedErr);
                } else {
                    console.log(err.message);
                }
            }
        });
    }

    let upArrowsAnswers = document.querySelectorAll(".up-arrow-answer");

    for (let upArrow of upArrowsAnswers) {
        upArrow.addEventListener("click", async (e) => {
            e.preventDefault();

            const voteCountSpan = document.querySelector(
                `#vote-count-answers-${e.target.dataset.answerid}`
            );

            try {
                const body = { isDownvote: false };
                let res = await fetch(
                    `/api/votes/answers/${e.target.dataset.answerid}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );

                console.log("yo wtf " + res.toString());
                if (!res.ok) throw res;
                let data = await res.json();
                console.log(data.voteCount);

                if (upArrow.classList.contains("voted")) {
                    upArrow.classList.remove("voted");
                } else {
                    if (
                        document
                            .querySelector(
                                `#down-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.contains("voted")
                    ) {
                        document
                            .querySelector(
                                `#down-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.remove("voted");
                    }
                    upArrow.classList.add("voted");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.log(parsedErr);
                } else {
                    console.log(err.message);
                }
            }
        });
    }

    let downArrowsAnswers = document.querySelectorAll(".down-arrow-answer");

    for (let downArrow of downArrowsAnswers) {
        downArrow.addEventListener("click", async (e) => {
            e.preventDefault();

            const voteCountSpan = document.querySelector(
                `#vote-count-answers-${e.target.dataset.answerid}`
            );

            try {
                const body = { isDownvote: true };
                let res = await fetch(
                    `/api/votes/answers/${e.target.dataset.answerid}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );

                if (!res.ok) throw res;
                let data = await res.json();

                if (downArrow.classList.contains("voted")) {
                    downArrow.classList.remove("voted");
                } else {
                    if (
                        document
                            .querySelector(
                                `#up-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.contains("voted")
                    ) {
                        document
                            .querySelector(
                                `#up-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.remove("voted");
                    }
                    downArrow.classList.add("voted");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.log(parsedErr);
                } else {
                    console.log(err.message);
                }
            }
        });
    }
});

// console.log(downArrows);
// for (let downArrow of downArrows) {
//     downArrow.addEventListener("click", (e) => {
//         e.preventDefault();
//         console.log(e.target.dataset.questionid);

//         downArrow.classList.remove("down-arrow");
//         downArrow.classList.add("down-arrow-voted");
//     });
// }

// let downArrows = document.querySelectorAll(".down-arrow");
// let downArrowsVoted = document.querySelectorAll(".up-arrow-voted");
// let downArrowsVoted = document.querySelectorAll(".down-arrow-voted");

// const resetNodeLists = () => {
//     upArrows = document.querySelectorAll(".up-arrow");
//     upArrowsVoted = document.querySelectorAll(".up-arrow-voted");

//     for (let upArrow of upArrows) {
//         upArrow.addEventListener("click", (e) => {
//             e.preventDefault();
//             console.log(e.target.dataset.questionid);

//             upArrow.classList.remove("up-arrow");
//             upArrow.classList.add("up-arrow-voted");
//             resetNodeLists();
//         });
//     }

//     for (let upArrowVoted of upArrowsVoted) {
//         upArrowVoted.addEventListener("click", (e) => {
//             e.preventDefault();

//             upArrowVoted.classList.remove("up-arrow-voted");
//             upArrowVoted.classList.add("up-arrow");
//             resetNodeLists();
//         });
//     }
// };

// for (let upArrow of upArrows) {
//     upArrow.addEventListener("click", (e) => {
//         e.preventDefault();
//         console.log(e.target.dataset.questionid);

//         upArrow.classList.remove("up-arrow");
//         upArrow.classList.add("up-arrow-voted");
//     });

//     resetNodeLists();
// }

// for (let upArrow of upArrows) {
//     upArrow.addEventListener("click", (e) => {
//         e.preventDefault();
//         console.log(e.target.dataset.questionid);

//         upArrow.classList.remove("up-arrow");
//         upArrow.classList.add("up-arrow-voted");
//     });

//     resetNodeLists();
// }

// for (let upArrowVoted of upArrowsVoted) {
//     upArrowVoted.addEventListener("click", (e) => {
//         e.preventDefault();

//         upArrowVoted.classList.remove("up-arrow-voted");
//         upArrowVoted.classList.add("up-arrow");
//     });

//     resetNodeLists();
