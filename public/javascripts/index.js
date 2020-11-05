window.addEventListener("load", (event) => {
    console.log("hello from javascript!");
});

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
