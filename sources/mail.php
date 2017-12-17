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

if ( (check_phone($phone)) && (strlen($salon) > 2) ) {
    echo('ok');
} else {
    echo('fail');
    die();
}

$msg = "Заявка с формы: '" . $form . "'" . "\nСалон: " . $salon . "\nТелефон: " . $phone;

file_put_contents('log.txt', $msg, FILE_APPEND);

file_put_contents('log.txt', $output, FILE_APPEND);

$headers = 'From: order@landing.ru';
$date = date('d-j-Y G:i');
$subject = 'Новая заявка с лендинга Петровский автоцентр от ' . $date;
mail('ksenialass@gmail.com', $subject, $msg, $headers);
?>
