// form & form attributes
let account_form = document.getElementById("account_form");
let uname = document.getElementById("name");
let pass = document.getElementById("pass");
let acc_type = document.getElementById("acc_type");
let opening_balance = document.getElementById("opening_balance");
let bank_name = document.getElementById("bank_name");
let error = document.getElementById("error_div");

// sounds
let inbox = new Audio("./sass/sounds/inbox.mp3");
let error_sound = new Audio("./sass/sounds/error.mp3");

// debit card atributes
let bank_name_db = document.querySelector(".atm_card .face .row1 .bank_name");
let card_no_db = document.querySelector(".atm_card .face .card_no");
let valid_db = document.querySelector(".atm_card .face .validity .date");
let name_db = document.querySelector(".atm_card .face .name");

//mini-statement attributes
let MiniStat = document.querySelector(".mini_s");
let close_btn_mini = document.querySelector(".mini_s .close_btn");
let mini_bname = document.querySelector(".mini_s .bank_info .bank_name");
let mini_name = document.querySelector(".mini_s .bank_info .name");
let mini_acc_no = document.querySelector(".mini_s .bank_info .acc_no");
let mini_bal = document.querySelector(".mini_s .banking_details .balance .bal");
let mini_type = document.querySelector(".mini_s .banking_details .acc_type .type");
let mini_created_on = document.querySelector(".mini_s .banking_details .created .created_on");
let mini_todayD = document.querySelector(".mini_s .banking_details .date .todayD");


// message box (Inbox)
let msg_box = document.querySelector(".msg_box");
let close_btn = document.querySelector(".close_btn");
let messages = document.querySelector(".messages");

// bank names of available banks
let bank_names = ["State Bank Of India", "Punjab National Bank", "Maharashtra Bank", "Axis Bank", "ICICI", "Cosmos Bank", "HDFC", "PM Jan Dhan Yojna"];



// showing messages like inbox
let showMsgInbox = (result, inboxMsg, bool) => {
    let d = new Date();
    messages.innerText = `${inboxMsg} on ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    let left_balance = document.createElement("p");
    left_balance.innerText = `Remaining Balance: ${result}`;
    messages.appendChild(left_balance);
    if (bool) inbox.play();
    (!bool && close_btn.addEventListener("click", () => messages.classList.toggle("show")));
}
let Load = () => {
    let msg = "No Transaction done this time";
    let bal = JSON.parse(localStorage.getItem("Account"));
    if (bal !== null) {
        showMsgInbox(JSON.parse(bal[0].balance), msg, false);
    }
}



// Account Class
class Account {
    constructor() {
        this.acc_no = Account.getAccountNo();
        this.arr = [{
            name: uname.value,
            pass: pass.value,
            balance: opening_balance.value,
            type: acc_type.value,
            acc_no: this.acc_no,
            bank_name: bank_name.value,
            date: [new Date().getMonth() + 1, new Date().getFullYear()]
        }];
        localStorage.setItem("Account", JSON.stringify(this.arr));
    }
    //get account number
    static getAccountNo = () => {
        let acc_no = "";
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                acc_no += `${Math.floor(Math.random() * 9)}`;
            }
            acc_no += " ";
        }
        return acc_no;
    }
    // card expiry date
    static newDate = () => {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        return new Date(year + 2, month >= 11 ? month + 1 : month + 2);
    }
    // displaying card info
    static display_atm = () => {
        // hiding form
        document.querySelector(".bank_form").style.display = "none";
        document.querySelector(".atm").classList.add("show");
        // data
        let account = JSON.parse(localStorage.getItem("Account"));
        // expiry date
        let date = Account.newDate();
        let year = `${date.getFullYear()}`;
        // displaying data on card
        account.forEach(item => {
            bank_name_db.innerText = item.bank_name;
            name_db.innerText = item.name;
            card_no_db.innerText = item.acc_no;
            valid_db.innerText = `${date.getMonth()}/${year.substr(2,)}`;
        });
        //displaying message box
        msg_box.style.display = "inline-block";
        Load();

    }
}

/********************
Banking operations
**********************/
class Operations {
    // Withdraw Operation
    static Withdraw = () => {
        this.showModel("Enter Amount To Withdraw", "Withdraw");
        let arr = [];
        let account = JSON.parse(localStorage.getItem("Account"));
        let form = document.getElementById("modal_form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let amt = parseInt(account[0].balance);
            let pass = account[0].pass;
            let enter_pass = document.getElementById("pin").value;
            let enter_amt = document.getElementById("msg").value;
            enter_amt = parseInt(enter_amt);
            if (enter_pass === pass) {
                if (enter_amt <= amt && enter_amt >= 100) {
                    let result = amt - enter_amt;
                    // object destructring & updating balance
                    let arr2 = { ...account[0], balance: result };
                    arr.push(arr2);
                    localStorage.setItem("Account", JSON.stringify(arr));
                    document.querySelector(".atm").classList.remove("blur");
                    document.querySelector(".modal").classList.remove("show");
                    let inboxMsg = `Rs ${enter_amt} has been debited from your account`;
                    showMsgInbox(result, inboxMsg, true);
                }
                else {
                    error_sound.play();
                    alert("Insufficient Balance!!");
                }
            }
            else {
                error_sound.play()
                alert("Wrong Password!!");
            }
        })
    }
    // Deposit Operation
    static Deposit = () => {
        this.showModel("Enter Amount To Deposit", "Deposit");
        let arr = [];
        let account = JSON.parse(localStorage.getItem("Account"));
        let form = document.getElementById("modal_form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let amt = parseInt(account[0].balance);
            let pass = account[0].pass;
            let enter_pass = document.getElementById("pin").value;
            let enter_amt = document.getElementById("msg").value;
            enter_amt = parseInt(enter_amt);
            if (enter_pass === pass) {
                if (enter_amt >= 100) {
                    let result = amt + enter_amt;
                    // object destructring & updating balance
                    let arr2 = { ...account[0], balance: result };
                    arr.push(arr2);
                    localStorage.setItem("Account", JSON.stringify(arr));
                    document.querySelector(".atm").classList.remove("blur");
                    document.querySelector(".modal").classList.remove("show");
                    let inboxmsg = `Rs ${enter_amt} has been credited to your account`;
                    showMsgInbox(result, inboxmsg, true);
                }
                else {
                    error_sound.play();
                    alert("Minimum Deposit Balance!!: 100rs");
                }
            }
            else {
                error_sound.play();
                alert("Wrong Password!!");
            }
        })
    }
    //MiniStatement
    static MiniStatement = () => {
        let data = JSON.parse(localStorage.getItem("Account"));
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        if (data !== null && data !== "" && data !== []) {
            MiniStat.classList.add("animate__animated", "animate__flipInY");
            MiniStat.style.display = "block";
            mini_name.innerText = data[0].name;
            mini_acc_no.innerText = data[0].acc_no;
            mini_bname.innerText = data[0].bank_name;
            mini_bal.innerText = data[0].balance;
            mini_type.innerText = data[0].type;
            mini_created_on.innerText = `${data[0].date[0]}/${data[0].date[1]}`;
            mini_todayD.innerText = `${date}/${month}/${year}`;
            let ib_msg = "Mini Statement Given To You";
            showMsgInbox(data[0].balance, ib_msg, true);
        }
        close_btn_mini.addEventListener("click", () => {
            MiniStat.classList.remove("animate__animated", "animate__flipInY");
            MiniStat.style.display = "none";
        });
    }
    // Change Password
    static ChangePass = () => {
        this.showModel("Enter New Password", "Change");
        let arr = [];
        let account = JSON.parse(localStorage.getItem("Account"));
        let form = document.getElementById("modal_form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let passw = account[0].pass;
            let enter_pass = document.getElementById("pin").value;
            let change_pass = document.getElementById("msg").value;
            if (change_pass != enter_pass) {
                if (enter_pass == passw) {
                    // object destructring & updating pass
                    let arr2 = { ...account[0], pass: change_pass };
                    arr.push(arr2);
                    localStorage.setItem("Account", JSON.stringify(arr));
                    document.querySelector(".atm").classList.remove("blur");
                    document.querySelector(".modal").classList.remove("show");
                    let inboxmsg = `Your Password Has Been Changed`;
                    location.reload();
                    showMsgInbox("Can't Update!!", inboxmsg, true);
                }
                else {
                    error_sound.play();
                    alert("Invalid OLD Password!!");
                }
            }
            else {
                error_sound.play();
                alert("Both Passwords Are Same!!\nCan't Change");
            }
        })
    }
    //Delete Account
    static DeleteAcc = () => {
        let yes = confirm("Are You Sure You Want To Delete This Account");
        if (yes) {
            localStorage.clear();
            location.reload();
        }
    }

    // showing model
    static showModel = (msg, btnText = "Operate") => {
        document.querySelector(".atm").classList.add("blur");
        document.querySelector(".modal").classList.add("show");
        document.getElementById("msg").previousElementSibling.innerText = msg;
        document.getElementById("operate_btn").innerText = btnText;
        document.querySelector(".hide_btn").addEventListener("click", () => {
            document.querySelector(".atm").classList.remove("blur");
            document.querySelector(".modal").classList.remove("show");
        });
    }
}
// Account class object
let obj;


// checking if account is already made, if it's then hide form
let checkAccount = localStorage.getItem("Account");
(checkAccount !== null && Account.display_atm());




// Submitting the form to create account
account_form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (uname.value.length >= 5 && uname.value.length <= 30) {
        if (pass.value.length >= 5 && pass.value.length <= 15) {
            if (acc_type.value === "Savings" || acc_type.value === "Current") {
                if (opening_balance.value >= 100) {
                    if (bank_names.includes(bank_name.value)) {
                        // create new account with constructor
                        let account = localStorage.getItem("Account");
                        if (account == null) {
                            obj = new Account();
                            Account.display_atm();
                        }
                        else {
                            error.innerText = "Your Account Already Exists!!";
                            Account.display_atm();
                        }
                    }
                    else error.innerText = "Select a Valid Bank!!";
                }
                else error.innerText = "Opening Balance Should Be Atleast 1000rs!!";
            }
            else error.innerText = "Enter Account Type!!";
        }
        else error.innerText = "Enter Strong Password[>5 & <15]!!";
    }
    else error.innerText = "Please Enter Valid Name[>15 & <30]!!";
});




//Performing operations
// 1]. Widthdraw
document.getElementById("withdraw").addEventListener("click", () => {
    Operations.Withdraw();
});
// 2]. Deposit
document.getElementById("deposit").addEventListener("click", () => {
    Operations.Deposit();
});
// 3]. Mini-Statement
document.getElementById("mini").addEventListener("click", () => {
    Operations.MiniStatement();
});
// 4]. Change Password
document.getElementById("changePass").addEventListener("click", () => {
    Operations.ChangePass();
});
// 5]. Delete Account
document.getElementById("delete").addEventListener("click", () => {
    Operations.DeleteAcc();
});