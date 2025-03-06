let discussions = null;

function createDiscussion(subject, question) {
  let id = 1;
  const discussion = {
    subject: subject,
    question: question,
    responses: null,
  };
  if (discussions != null && Object.keys(discussions).length > 0) {
    id = Number(Object.keys(discussions)[Object.keys(discussions).length - 1]);
    discussions[++id] = discussion;
  } else {
    discussions = { [id]: discussion };
  }
  saveDiscussion();
  return id;
}

function deleteDiscussion(dis_id) {
  if (discussions != null) {
    delete discussions[dis_id];
    const question_element = document.getElementById(dis_id);
    question_element.remove();
  }
  saveDiscussion();
}

function makeDiscussion(id, subject, question) {
  const question_pane = document.querySelector(".question-pane .all-questions");
  const question_element = document.createElement("div");
  question_element.className = "question";
  question_element.id = id;
  const title = document.createElement("div");
  title.className = "title";
  title.innerHTML = subject;
  const desc = document.createElement("div");
  desc.className = "desc";
  desc.innerHTML = question;

  question_element.appendChild(title);
  question_element.appendChild(desc);
  question_pane.appendChild(question_element);
}

function clearDiscussions() {
  const question_pane = document.querySelector(".question-pane .all-questions");
  question_pane.innerHTML = null;
}

function saveDiscussion() {
  localStorage.setItem("discussions", JSON.stringify(discussions));
}

function loadDiscussion() {
  discussions = JSON.parse(localStorage.getItem("discussions"));
  if (discussions != null) {
    for (let dis_id in discussions) {
      let discussion = discussions[dis_id];
      makeDiscussion(dis_id, discussion.subject, discussion.question);
    }
  }
}
loadDiscussion();

function addDiscussionHandler() {
  const title = document.querySelector(".question-form form input");
  const desc = document.querySelector(".question-form form textarea");
  const subject = title.value;
  const question = desc.value;
  if (subject === "" || subject === " " || subject === null) {
    return;
  }
  if (question === "" || question === " " || question === null) {
    return;
  }
  const dis_id = createDiscussion(subject, question);
  makeDiscussion(dis_id, subject, question);
  title.value = null;
  desc.value = null;
}
const discussion_submit_btn = document.querySelector(
  ".question-form .btn button"
);
discussion_submit_btn.addEventListener("click", addDiscussionHandler);

function toggleForm(opr) {
  const question_form_pane = document.querySelector(
    ".form-field .question-form"
  );
  const response_form_pane = document.querySelector(
    ".form-field .response-form"
  );
  if (opr == 0 && question_form_pane.classList.contains("hide")) {
    question_form_pane.classList.remove("hide");
    response_form_pane.classList.add("hide");
  } else if (opr == 1 && response_form_pane.classList.contains("hide")) {
    question_form_pane.classList.add("hide");
    response_form_pane.classList.remove("hide");
  }
}

function discussionClickHandler(e) {
  if (e.target.tagName === "BUTTON") {
    toggleForm(0);
  }
  if (
    e.target.className === "question" ||
    e.target.parentNode.className === "question"
  ) {
    let id = 1;
    if (e.target.className == "title" || e.target.className == "desc") {
      id = e.target.parentNode.id;
    } else {
      id = e.target.id;
    }
    toggleForm(1);
    const question_tab = document.querySelector(".response-form .question-tab");
    const question_title = document.querySelector(
      ".response-form .question .title"
    );
    const question_desc = document.querySelector(
      ".response-form .question .desc"
    );
    question_tab.id = `q${id}`;
    question_title.innerHTML = discussions[id].subject;
    question_desc.innerHTML = discussions[id].question;
    clearResponses();
    loadResponses(id);
  }
//   if 
}
const discussion_panel = document.querySelector(".questions-field");
discussion_panel.addEventListener("click", discussionClickHandler);

function createResponse(dis_id, subject, solution) {
  let rid = 1;
  const response = {
    subject: subject,
    solution: solution,
    upvote: 0,
  };
  let responses = discussions[dis_id].responses;
  if (
    responses == null ||
    Object.keys(discussions[dis_id].responses).length == 0
  ) {
    discussions[dis_id].responses = { [rid]: response };
  } else {
    rid = Number(
      Object.keys(discussions[dis_id].responses)[
        Object.keys(discussions[dis_id].responses).length - 1
      ]
    );
    discussions[dis_id].responses[++rid] = response;
  }
  saveDiscussion();
  return rid;
}

function deleteResponse(dis_id, rid) {
  if (
    discussions[dis_id].responses != null &&
    Object.keys(discussions[dis_id].responses).length > 0
  ) {
    delete discussions[dis_id].responses[rid];
    const response_element = document.getElementById(`${dis_id}:${rid}`);
    response_element.remove();
    saveDiscussion();
  }
}

function makeResponse(dis_id, rid, subject, solution, upvote) {
  const responses_pane = document.querySelector(
    ".response-form .question-tab .responses"
  );
  const response_div = document.createElement("div");
  response_div.className = "response";
  response_div.id = `${dis_id}:${rid}`;
  const response_title = document.createElement("span");
  response_title.innerHTML = subject;
  response_title.className = "title";
  const response_desc = document.createElement("span");
  response_desc.innerHTML = solution;
  response_desc.className = "desc";
  const options = document.createElement("span");
  options.innerHTML = `<p>${upvote}</p><i class="fa fa-arrow-up" aria-hidden="true" title="upvote" name="upvote"></i><i class="fa fa-arrow-down" aria-hidden="true" title="downvote" name="downvote"></i><i class="fa fa-trash" aria-hidden="true" title="delete" name="delete"></i>`;
  options.className = "options";

  response_div.appendChild(response_title);
  response_div.appendChild(response_desc);
  response_div.appendChild(options);
  responses_pane.appendChild(response_div);
}

function clearResponses() {
  const responses_pane = document.querySelector(
    ".response-form .question-tab .responses"
  );
  responses_pane.innerHTML = null;
}

function loadResponses(dis_id) {
  const responsesObj = discussions[dis_id].responses;
  if (
    responsesObj != null &&
    Object.keys(discussions[dis_id].responses).length > 0
  ) {
    const sortableResponses = Object.entries(responsesObj)
        .sort((a, b) => b[1].upvote - a[1].upvote);
    // console.log(sortableResponses);
    sortableResponses.forEach(([rid, response]) => {
      makeResponse(
        dis_id,
        rid,
        response.subject,
        response.solution,
        response.upvote
      );
    });
  }
}

function questionTabHandler(e) {
  let task = e.target.getAttribute("name");
  if (task === "resolve") {
    let dis_id = Number(e.target.parentNode.parentNode.id.split("q")[1]);
    deleteDiscussion(dis_id);
    toggleForm(0);
  } else if (task === "add-response") {
    let dis_id = Number(
      e.target.parentNode.parentNode.parentNode.parentNode.id.split("q")[1]
    );

    const title = document.querySelector(".response-form-tab form input");
    const desc = document.querySelector(".response-form-tab form textarea");
    const subject = title.value;
    const solution = desc.value;
    if (subject === "" || subject === " " || subject === null) {
      return;
    }
    if (solution === "" || solution === " " || solution === null) {
      return;
    }
    const rid = createResponse(dis_id, subject, solution);
    makeResponse(dis_id, rid, subject, solution, 0);
    title.value = null;
    desc.value = null;
  } else if (task === "upvote") {
    // console.log(e.target.parentNode.parentNode.id);
    const ids = e.target.parentNode.parentNode.id.split(":");
    const dis_id = Number(ids[0]);
    const rid = Number(ids[1]);
    discussions[dis_id].responses[rid].upvote += 1;
    let count = document.getElementById(`${e.target.parentNode.parentNode.id}`);
    count = count.querySelector(".options p");
    count.innerText = discussions[dis_id].responses[rid].upvote;
    saveDiscussion();
  } else if (task === "downvote") {
    const ids = e.target.parentNode.parentNode.id.split(":");
    const dis_id = Number(ids[0]);
    const rid = Number(ids[1]);
    let upvotes = discussions[dis_id].responses[rid].upvote;
    if (upvotes > 0) discussions[dis_id].responses[rid].upvote -= 1;
    let count = document.getElementById(`${e.target.parentNode.parentNode.id}`);
    count = count.querySelector(".options p");
    count.innerText = discussions[dis_id].responses[rid].upvote;
    saveDiscussion();
  } else if (task === "delete") {
    // console.log("delete");
    const ids = e.target.parentNode.parentNode.id.split(":");
    const dis_id = Number(ids[0]);
    const rid = Number(ids[1]);
    deleteResponse(dis_id, rid);
  }
}
const question_tab = document.querySelector(".response-form .question-tab");
question_tab.addEventListener("click", questionTabHandler);

let made_changes = false;
function searchHandler(e) {
  let substring = e.target.value.toLowerCase();
  const not_found = document.getElementById("not-found");
  if (substring != " " && substring != "") {
    made_changes = true;
    not_found.classList.add("hide");
    clearDiscussions();
    let bool = true;
    for (let dis_id in discussions) {
      let cmp1 = discussions[dis_id].subject.toLowerCase();
      let cmp2 = discussions[dis_id].question.toLowerCase();
      if (cmp1.includes(substring) || cmp2.includes(substring)) {
        bool = false;
        // console.log(discussions[dis_id].subject);
        let subject = discussions[dis_id].subject;
        let question = discussions[dis_id].question;

        let st_idx = cmp1.indexOf(substring);
        const ori_subject = subject.slice(st_idx, st_idx + substring.length);
        subject = subject.replace(ori_subject, `<hg>${ori_subject}</hg>`);

        st_idx = cmp2.indexOf(substring);
        const ori_question = question.slice(st_idx, st_idx + substring.length);
        question = question.replace(ori_question, `<hg>${ori_question}</hg>`);

        makeDiscussion(dis_id, subject, question);
      }
    }
    if (bool) {
      not_found.classList.remove("hide");
    }
  } else if (made_changes) {
    not_found.classList.add("hide");
    clearDiscussions();
    loadDiscussion();
    made_changes = false;
  }
}
discussion_panel.addEventListener("keyup", searchHandler);
