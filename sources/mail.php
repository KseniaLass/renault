<?php
ob_start();
$output = ob_get_clean();
$msg='';
function check_phone($phone){
    $numeric = preg_replace('/[^0-9+]/', '', $phone);
    if(strlen(intval($numeric)) < 10) {
        return false;
    }
    return true;
}
$form = trim($_POST['form']);
$phone = trim($_POST['phone']);
$salon = trim($_POST['salon']);
$id = trim($_POST['id']);

$name = trim($_POST['name']) || '';
$email = trim($_POST['email']) || '';

switch ($id) {
    case 1:
        $recipients = 'antipov.anton@petrovskiy.ru , sorokin.dmitriy@petrovskiy.ru, merzhoeva.anna@petrovskiy.ru';
        $steamer = 'ОП Софийская spa1@petrovskiy.ru';
        break;

    case 2:
        $recipients = 'abramichev.andrej@petrovskiy.ru , novikov.sergey@petrovskiy.ru, merzhoeva.anna@petrovskiy.ru';
        $steamer = 'ОП Ленинский spa2@petrovskiy.ru';
        break;

    case 3:
        $recipients = 'klimenko.alexey@petrovskiy.ru , tyurin.maksim@petrovskiy.ru, merzhoeva.anna@petrovskiy.ru';
        $steamer = 'ОП Руставели spa3@petrovskiy.ru';
        break;
}

if ( (check_phone($phone)) && (strlen($salon) > 2) ) {
    echo('ok');
} else {
    echo('fail');
    die();
}

$msg = <<<EOD
    Лендинг: 
    Скидка 10 000 рублей.
    
    Имя:
    $name
    
    Email:
    $email
    
    Телефон:
    $phone
    
    Салон:
    $salon
    
    Кнопка на которую нажали:
    $form
    
    Служба:
    Отдел продаж новых автомобилей
EOD;


//$msg = "Лендинг: Скидка 10 000 рублей. \n\nИмя: Заявка с формы: '" . $form . "'" . "\nСалон: " . $salon . "\nТелефон: " . $phone;

file_put_contents('log.txt', $msg, FILE_APPEND);

file_put_contents('log.txt', $output, FILE_APPEND);

$headers = 'From: ' . $steamer;
$date = date('d-j-Y G:i');
$subject = 'Новая заявка с лендинга "Скидка 10 000 рублей" от ' . $date;
mail($recipients, $subject, $msg, $headers);
?>
