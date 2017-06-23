<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Position;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PositionController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('', array('name' => $name));
    }

    public function positionListAction()
    {
        $parameters = [];
        $em = $this->get('doctrine.orm.entity_manager');
        $positions = $em->getRepository(Position::class)->findAll();
        $parameters = array_merge($parameters, ['positions' => $positions]);

        return $this->render('@App/Default/index.html.twig', $parameters);
    }

    public function positionAddAction()
    {

    }

    public function positionShowAction($id)
    {

    }
}
