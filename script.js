window.addEventListener('DOMContentLoaded', () => {
  
  let tasks = [];
  
  // untuk mengarahkan kw form login atau register
  const boxLogin = document.querySelector('.box-login');
  const boxRegister = document.querySelector('.box-register');
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      // mencegah default behavior element HTML seperti link, form dan lain sebagainya
      event.preventDefault();
      // ambil isi class dari element yang ditekan
      const classname = this.className;
      // jalankan fungsi showAndHideBox();
      showAndHideBox(classname);
    });
  });
  
  function showAndHideBox(param) {
    /*
      jika element yang ditekan memiliki class yang ada kaitannya dengan 
      kata "register" maka sembunyikan form register dan tampilkan form login
    */
    if (param.includes('register')) {
      boxRegister.style.display = 'none';
      boxLogin.style.display = 'block';
    }
    /*
      jika element yang ditekan memiliki class yang ada kaitannya dengan 
      kata "login" maka sembunyikan form login dan tampilkan form register
    */
    if (param.includes('login')) {
      boxLogin.style.display = 'none';
      boxRegister.style.display = 'block';
    }
  }
  
  // icon mata yang ada di tiap input password
  const icons = document.querySelectorAll('#icon');
  icons.forEach(icon => {
    icon.addEventListener('click', function() {
      // ubah tipe input sesuai class dari ikon input
      const input = this.parentElement.querySelector('.input-password');
      input.setAttribute('type', setTypeInput(this.className));
      // ubah ikon input ketika ditekan
      setInputIcon(this);
    });
  });
  
  function setTypeInput(classname) {
    return (classname == 'fa-solid fa-eye') ? 'text' : 'password';
  }
  
  function setInputIcon(param) {
    param.className = (param.className == 'fa-solid fa-eye') ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  }
  
  // input yang berada pada form register 
  const input_username_register = document.querySelector('.input_username_register');
  const input_password_register = document.querySelector('.input_password_register');
  const input_confirm_password = document.querySelector('.input_confirm_password');
  const btnRegister = document.querySelector('.btn-register');
  btnRegister.addEventListener('click', register);
  
  function register(event) {
    // mencegah default behavior element HTML seperti link, form dan lain sebagainya
    event.preventDefault();
    // value input di form register
    const usernameRegister = input_username_register.value.trim();
    const passwordRegister = input_password_register.value.trim();
    const confirmPassword = input_confirm_password.value.trim();
    // validasi tiap input terlebih dahulu
    if (validate(usernameRegister, passwordRegister)) {
      // masukkan value input register kedalam objek
      const data = {
        username: usernameRegister,
        password: CryptoJS.SHA256(passwordRegister).toString(),
        confirmPassword: CryptoJS.SHA256(confirmPassword).toString()
      };
      // konfirmasi password
      if (confirmationPassword(data)) {
        // cek apakah data yang diinputkan sudah pernah dibuat atau tidak
        if (isDataExist(data)) {
          // jika data sudah pernah dibuat
          return alerts('error', 'This data has already been created');
        } else {
          // jika data belum pernah dibuat
          // masukkan isi variabel "data" kedalam variabel "tasks"
          tasks.unshift(data);
          // simpan perubahan data kedalam localstorage
          saveToLocalstorage();
          // beri pesan bahwa "berhasil membuat data"
          alerts('success', 'data created successfully');
          // bersihkan form
          clear();
        }
      }
    }
  }
  
  function validate(username, password) {
    // jika semua input kosong
    if (!username && !password) return alerts('error', 'All input is empty!');
    // jika input username kosong
    if (!username) return alerts('error', 'field username is empty!');
    // jika input password kosong
    if (!password) return alerts('error', 'field password is empty!');
    // jika username terlalu pendek
    if (username.length < 3) return alerts('error', 'field username must be more than 3 character!');
    // jika username terlalu panjang
    if (username.length > 20) return alerts('error', 'field username must be no more than 20 character!');
    // jika username berisikan spasi
    if (username.match(/\s/gi)) return alerts('error', 'please enter valid username without spaces!');
    // jika password terlalu pendek
    if (password.length < 5) return alerts('error', 'field password must be more than 5 character!');
    // jika berhasil melewati semua validasi
    return true;
  }
  
  function alerts(type, text) {
    // plugin dari "sweetalert2"
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function confirmationPassword({ password, confirmPassword }) {
    // jika password tidak cocok
    if (password != confirmPassword) return alerts('error', 'Password not matched!');
    // jika password cocok
    return true;
  }
  
  function isDataExist({ username, password }) {
    // hasil default apabila data belum pernah dibuat
    let exist = false;
    tasks.forEach(task => {
      // jika data sudah pernah dibuat
      if (task.username == username && task.password == password) exist = true;
      if (task.username == username && task.password != password) exist = true;
    });
    // kembalikan nilai boolean true atau false
    return exist;
  }
  
  function saveToLocalstorage() {
    /*
      parsing isi variabel "tasks" menjadi string json dan setelah itu simpan isi variabel
      "tasks" kedalam localstorage 
    */
    localStorage.setItem('data-user', JSON.stringify(tasks));
  }
  
  function clear() {
    // bersihkan form
    const form = document.querySelector('.form');
    form.reset();
  }
  
  // input yang berada pada form login
  const input_username_login = document.querySelector('.input_username_login');
  const input_password_login = document.querySelector('.input_password_login');
  const btnLogin = document.querySelector('.btn-login');
  btnLogin.addEventListener('click', login);
  
  function login(event) {
    // mencegah default behavior element HTML seperti link, form dan lain sebagainya
    event.preventDefault();
    // value input yang berada di form login 
    const usernameLogin = input_username_login.value.trim();
    const passwordLogin = input_password_login.value.trim();
    // validasi terlebih dahulu
    if (validate(usernameLogin, passwordLogin)) {
      // masukkan value kedalam objek 
      const data = {
        username: usernameLogin,
        password: CryptoJS.SHA256(passwordLogin).toString()
      };
      // cek user 
      checkUser(data);
    }
  }
  
  function checkUser({ username, password }) {
    // ambil data yang ada didalam localstorage
    const data = localStorage.getItem('data-user');
    /*
      ubah isi variabel "tasks" dengan data yang sudah diparsing menjadi json apabila
      variabel "data" menghasilkan boolean true. tapi apabila variabel "data" mengembalikan 
      boolean false, maka ubah isi variabel "tasks" dengan array kosong
    */
    tasks = (data) ? JSON.parse(data) : [];
    // looping variabel "tasks"
    tasks.forEach(task => {
      // jika username dan password valid
      if (task.username == username && task.password == password) return alerts('success', `welcome, ${task.username}`); 
      // jika username tidak valid dan password valid
      if (task.username != username && task.password == password) return alerts('error', `username not valid!`); 
      // jika username valid dan password tidak valid
      if (task.username == username && task.password != password) return alerts('error', `password not valid!`); 
      // jika username dan password tidak valid
      if (task.username != username && task.password != password) return alerts('error', `user not valid!`); 
    });
  }
  
});