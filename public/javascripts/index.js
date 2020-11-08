window.addEventListener("load", (event) => {
    const searchForm = document.querySelector(".search-form");

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

            let { questions } = parsedResponse;

            if (questions.length === 0) {
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

                if (!res.ok) throw res;
                let data = await res.json();

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
                    console.error(parsedErr);
                } else {
                    console.error(err.message);
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

                if (!res.ok) throw res;
                let data = await res.json();

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
                    console.error(parsedErr);
                } else {
                    console.error(err.message);
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

                if (!res.ok) throw res;
                let data = await res.json();

                if (upArrow.classList.contains("voted-answer")) {
                    upArrow.classList.remove("voted-answer");
                } else {
                    if (
                        document
                            .querySelector(
                                `#down-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.contains("voted-answer")
                    ) {
                        document
                            .querySelector(
                                `#down-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.remove("voted-answer");
                    }
                    upArrow.classList.add("voted-answer");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.error(parsedErr);
                } else {
                    console.error(err.message);
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

                if (downArrow.classList.contains("voted-answer")) {
                    downArrow.classList.remove("voted-answer");
                } else {
                    if (
                        document
                            .querySelector(
                                `#up-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.contains("voted-answer")
                    ) {
                        document
                            .querySelector(
                                `#up-arrow-answer-${e.target.dataset.answerid}`
                            )
                            .classList.remove("voted-answer");
                    }
                    downArrow.classList.add("voted-answer");
                }

                voteCountSpan.innerHTML = data.voteCount;
            } catch (err) {
                if (err.json) {
                    parsedErr = await err.json();
                    console.error(parsedErr);
                } else {
                    console.error(err.message);
                }
            }
        });
    }

    const darkModeBtn = document.querySelector(".dark-mode-btn");
    darkModeBtn.addEventListener("click", (e) => {
        document.documentElement.classList.toggle("dark-mode");
    });
});
