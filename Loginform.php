<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="Loginform.css" />
  </head>
  <body>
    <div class="wrapper">
      <div class="card-switch">
        <label class="switch">
          <input type="checkbox" class="toggle" />
          <span class="slider"></span>
          <span class="card-side"></span>
          <div class="flip-card__inner">
            <div class="flip-card__front">
              <div class="title">Log in</div>
              <form
                class="flip-card__form"
                action="Controller/login.php"
                method="POST"
              >
                <input
                  class="flip-card__input"
                  name="userid"
                  placeholder="User ID"
                  type="text"
                  required
                />
                <input
                  class="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
                <button class="flip-card__btn" type="submit">Let's go!</button>
              </form>
              <?php
              if (isset($_SESSION['login_error'])) {
                echo '<div class="error-message">' . htmlspecialchars($_SESSION['login_error']) . '</div>';
                unset($_SESSION['login_error']);
              }
              ?>
              <?php
              if (isset($_SESSION['register_error'])) {
                echo '<div class="error-message">' . htmlspecialchars($_SESSION['register_error']) . '</div>';
                unset($_SESSION['register_error']);
              }
              ?>
            </div>
            <div class="flip-card__back">
              <div class="title">Sign up</div>
              <form
                class="flip-card__form"
                action="Controller/register.php"
                method="POST"
              >
                <input
                  class="flip-card__input"
                  name="userid"
                  placeholder="User ID"
                  type="text"
                  required
                />
                <input
                  class="flip-card__input"
                  name="name"
                  placeholder="Name"
                  type="text"
                  required
                />
                <input
                  class="flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                />
                <input
                  class="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
                <button class="flip-card__btn" type="submit">Confirm!</button>
              </form>

            </div>
          </div>
        </label>
      </div>
    </div>
  </body>
</html>