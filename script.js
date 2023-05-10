// Defining page variables
var spinnerDiv = document.getElementById("spinnerDiv");
var tableBody = document.getElementById("tableBody");
var perPageSelector = document.getElementById("perPageSelector");
var pagesContainer = document.getElementById("pagesContainer");

// Defining page data
var rows = [];
var currentPageNumber = 1;
var numPages = 1;
var perPage = parseInt(perPageSelector.value);

// creates and returns the html for one table row
function createRowHTML(rowData) {
  var textBody = rowData.body;
  if (textBody.length > 100) {
    textBody = textBody.slice(0, 100);
    // alert(textBody);
  }
  var html = `
        <tr>
          <td>${rowData.id}</td>
          <td>${rowData.title}</td>
          <td>${textBody}</td>
        </tr>
        `;
  return html;
}

// Generates and displays html for all rows
function displayRows(rows) {
  var html = "";
  for (let i = 0; i < rows.length; i++) {
    var rowData = rows[i];
    var rowHTML = createRowHTML(rowData);
    html += rowHTML;
  }
  tableBody.innerHTML = html;
}

// creates and displays the html for the page buttons
function displayPageButtons(numPages) {
  var html = "";
  for (let i = 1; i < numPages + 1; i++) {
    var pageButton = `
            <button id="pageButton${i}" class='page-button btn btn-sm btn-outline-primary' onclick='showPage(${i})'>${i}</button>
          `;
    html += pageButton;
  }
  pagesContainer.innerHTML = html;
  var currentPageBtn = document.getElementById(
    `pageButton${currentPageNumber}`
  );
  currentPageBtn.classList.remove("btn-outline-primary");
  currentPageBtn.classList.add("btn-primary");
}

// selects the rows of the seleted page and displays them
function showPage(page) {
  currentPageNumber = page;
  perPage = perPageSelector.value;
  var stop = currentPageNumber * perPage;
  var start = stop - perPage;
  var rowsToDisplay = rows.slice(start, stop);
  displayRows(rowsToDisplay);
  displayPageButtons(numPages);
}

// shows the next page if currentPage is not the last
function showNextPage() {
  if (currentPageNumber == numPages) return;
  currentPageNumber = currentPageNumber + 1;
  showPage(currentPageNumber);
}

// shows the previous page if currentPage is not the first
function showPreviousPage() {
  if (currentPageNumber == 1) return;
  currentPageNumber = currentPageNumber - 1;
  showPage(currentPageNumber);
}

// monitors a change in the entries per page selector and
// sets the number of entries per page (perPage)
// calculates the total number of pages (numPages)
perPageSelector.onchange = function () {
  perPage = perPageSelector.value;
  numPages = rows.length / perPage;
  showPage(1);
};

// retrieves all posts
// removes the spinner from view
// calculates the total number of pages (numPages)
// shows currentPage
fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => response.json())
  .then((data) => {
    rows = data;
    if (rows.length) spinnerDiv.classList.add("d-none");
    numPages = rows.length / perPage;
    showPage(currentPageNumber);
  });
