document.addEventListener('DOMContentLoaded', function () {

  // TODO: Add single email view
  // TODO: Read and archive mails
  // TODO: Reply to mails
  // TODO: Check to see if mail is read

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(recipient, subject, body) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (recipient === undefined) {
    document.querySelector('#compose-recipients').value = '';
  } else {
    document.querySelector('#compose-recipients').value = recipient;
  }
  if (subject === undefined) {
    document.querySelector('#compose-subject').value = '';
  } else {
    document.querySelector('#compose-subject').value = subject;
  }
  if (body === undefined) {
    document.querySelector('#compose-body').value = '';
  } else {
    document.querySelector('#compose-body').value = body;
  }

  document.querySelector("#compose-form").onsubmit = function () {
    // Get values
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Send email
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
        })
      })
      .then(response => response.json())
      .then(() => {
        load_mailbox("sent");
      })


    return false;
  }
}

function load_mailbox(mailbox) {

  // Delete previously loaded mails
  document.querySelector('#emails-view').value = "";

  fetch(`emails/${mailbox}`).then(response => response.json())
    .then(data => {
      console.log(data);
      data.forEach(element => {
        // Get values
        const sender = element["sender"];
        const subject = element["subject"];
        const timestamp = element["timestamp"];
        const id = element["id"];
        const read = element["read"];

        // HTML
        const mail = document.createElement("div");
        mail.id = id;
        const html_sender = document.createElement("h3");
        html_sender.innerHTML = `<strong>${sender}</strong>`;
        const html_subject = document.createElement("p");
        html_subject.innerHTML = subject;
        const html_time = document.createElement("h4");
        html_time.innerHTML = timestamp;

        // Css
        mail.className = "mail";
        html_subject.className = "subject";
        html_time.className = "time-stamp";
        if (read) {
          html_sender.className = "read";
        } else {
          html_sender.className = "sender";
        }

        // add to the DOM
        mail.appendChild(html_sender);
        mail.appendChild(document.createElement("hr"));
        mail.appendChild(html_subject);
        mail.appendChild(html_time);
        document.querySelector("#emails-view").appendChild(mail);

        // Click registration
        mail.addEventListener("click", () => load_email(mail.id));
      });
    });


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function load_email(id) {

  // Delete previously loaded mails
  document.querySelector('#emails-view').value = "";

  // Hide mailbox and other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Get mail info
  fetch(`emails/${id}`).then(response => response.json()).then(email => {
    // Get values
    const sender = email["sender"];
    const recipients = email["recipients"];
    const subject = email["subject"];
    const body = email["body"];
    const timestamp = email["timestamp"];
    const email_archived = email["archived"];

    // HTML
    const mail = document.querySelector("#email-view");
    const html_sender = document.querySelector("#email-from");
    html_sender.innerHTML = `From: <strong>${sender}</strong>`;
    const html_recipients = document.querySelector("#email-to");
    html_recipients.innerHTML = `To: <strong>${recipients}</strong>`;
    const html_subject = document.querySelector("#email-subject");
    html_subject.innerHTML = subject;
    const html_time = document.querySelector("#email-time");
    html_time.innerHTML = timestamp;
    const html_body = document.querySelector("#email-body");
    html_body.innerHTML = body;

    const html_archive = document.querySelector("#archive");
    if (email_archived) {
      html_archive.innerHTML = "Unarchive";
    } else {
      html_archive.innerHTML = "Archive";
    }

    // Connect reply button
    document.querySelector("#reply").addEventListener('click', () => {
      const reply_recipient = sender;
      const reply_subject = `Re: ${subject}`;
      const reply_body = `On ${timestamp}, ${sender} wrote:\n${body}`;
      compose_email(reply_recipient, reply_subject, reply_body);
    }, {
      once: true
    });

    // (Un)Archive button
    document.querySelector("#archive").addEventListener('click', () => {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: !email_archived
        })
      }).then(response => {
        load_mailbox("inbox");
      });
    }, {
      once: true
    });

    mail.style.display = 'block';

    // Set email to read
    fetch(`emails/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        read: true
      }),
    });
  });
}